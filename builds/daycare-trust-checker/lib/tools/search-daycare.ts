import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_daycare',
  description:
    'Search for a daycare or childcare facility across the web to find their website, state license info, review presence, and basic details. Start here. Provide the facility name and optionally the state/city.',
  parameters: {
    type: 'object',
    properties: {
      facility_name: {
        type: 'string',
        description: 'The daycare or childcare center name (e.g. "Bright Horizons", "Little Stars Academy")',
      },
      state: {
        type: 'string',
        description: 'State where the facility operates (e.g. "Texas", "CA")',
      },
      city: {
        type: 'string',
        description: 'City where the facility is located (optional)',
      },
      address: {
        type: 'string',
        description: 'Street address if known (optional)',
      },
    },
    required: ['facility_name'],
  },
}

async function searchDDG(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaycareTrustChecker/1.0)' },
    })
    if (!res.ok) return []
    const html = await res.text()
    const results: { title: string; url: string; snippet: string }[] = []
    const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
    let match
    while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
      const rawUrl = match[1]
      const title = match[2].replace(/<[^>]*>/g, '').trim()
      const snippet = match[3].replace(/<[^>]*>/g, '').trim()
      const urlMatch = rawUrl.match(/uddg=([^&]+)/)
      const actualUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : rawUrl
      if (title && actualUrl) results.push({ title, url: actualUrl, snippet })
    }
    return results
  } catch {
    return []
  }
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const facilityName = (args.facility_name as string || '').trim()
  const state = (args.state as string || '').trim()
  const city = (args.city as string || '').trim()
  const address = (args.address as string || '').trim()

  if (!facilityName) return 'Error: facility_name is required'

  const location = [city, state].filter(Boolean).join(', ')
  const sections: string[] = []
  sections.push(`# Daycare Search: ${facilityName}\n`)

  if (location) sections.push(`**Location**: ${location}`)
  if (address) sections.push(`**Address**: ${address}`)
  sections.push('')

  // 1. General web presence search
  const generalQuery = `"${facilityName}" ${location} daycare childcare`
  const generalResults = await searchDDG(generalQuery)
  sections.push('## Web Presence')
  if (generalResults.length > 0) {
    generalResults.forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })

    const hasWebsite = generalResults.some(r =>
      !r.url.includes('yelp.com') &&
      !r.url.includes('google.com') &&
      !r.url.includes('facebook.com') &&
      !r.url.includes('care.com') &&
      !r.url.includes('winnie.com') &&
      !r.url.includes('brightwheel.com')
    )
    if (hasWebsite) {
      sections.push('\n\u2705 Appears to have a dedicated website (positive signal).')
    } else {
      sections.push('\n\u26a0\ufe0f No dedicated facility website found \u2014 only directory listings.')
    }
  } else {
    sections.push(`\u26a0\ufe0f No web results found for "${facilityName}" ${location}. This facility may not have an online presence.`)
  }

  // 2. State licensing search
  const licenseQuery = `"${facilityName}" ${state} childcare license daycare license state`
  const licenseResults = await searchDDG(licenseQuery)
  sections.push('\n## State Licensing')
  if (licenseResults.length > 0) {
    licenseResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })

    const stateBoard = licenseResults.some(r =>
      r.url.includes('.gov') || r.url.includes('.state.') || r.url.includes('hhs.texas') || r.url.includes('ocfs.ny')
    )
    if (stateBoard) {
      sections.push('\n\u2705 Found results from state licensing resources.')
    }
  } else {
    sections.push(`\u26a0\ufe0f Could not find licensing information for "${facilityName}" in ${state || 'any state'}.`)
    sections.push('This could mean: unlicensed, exempt (religious), operates under a different name, or records are not indexed online.')
  }

  // 3. Review site presence
  const reviewResults = await searchDDG(`"${facilityName}" ${location} reviews (yelp OR google OR care.com OR winnie)`)
  sections.push('\n## Review Site Presence')
  if (reviewResults.length > 0) {
    reviewResults.slice(0, 4).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('\u26a0\ufe0f No review site listings found. This could mean the facility is very new or operates informally.')
  }

  // 4. Inspection / violation search
  const inspectionResults = await searchDDG(`"${facilityName}" ${state} inspection violation childcare`)
  sections.push('\n## Inspection & Violations (Initial)')
  if (inspectionResults.length > 0) {
    inspectionResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('No inspection or violation records found in initial search. Deep verification will search further.')
  }

  return sections.join('\n')
}
