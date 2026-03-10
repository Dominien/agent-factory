import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'verify_daycare',
  description:
    'Deep verification of a daycare facility: check for violations, complaints, news incidents, staff issues, and parent review patterns. Use after search_daycare.',
  parameters: {
    type: 'object',
    properties: {
      facility_name: {
        type: 'string',
        description: 'The daycare or childcare center name',
      },
      state: {
        type: 'string',
        description: 'State where the facility operates',
      },
      city: {
        type: 'string',
        description: 'City where the facility is located',
      },
      owner_name: {
        type: 'string',
        description: 'Owner or director name if known (optional)',
      },
      website_url: {
        type: 'string',
        description: 'Facility website URL if found (optional)',
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
  const ownerName = (args.owner_name as string || '').trim()
  const websiteUrl = (args.website_url as string || '').trim()

  if (!facilityName) return 'Error: facility_name is required'

  const location = [city, state].filter(Boolean).join(', ')
  const sections: string[] = []
  sections.push(`# Daycare Verification: ${facilityName}\n`)

  // 1. Complaints and negative reports
  const complaintResults = await searchDDG(`"${facilityName}" ${location} complaint abuse neglect warning "shut down"`)
  sections.push('## Complaints & Warnings')
  if (complaintResults.length > 0) {
    const relevant = complaintResults.filter(r =>
      /complaint|abuse|neglect|warning|shut.?down|violation|incident|injur|death|danger|unsafe/i.test(r.snippet)
    )
    if (relevant.length > 0) {
      sections.push('\u26a0\ufe0f **Found complaints or warnings:**')
      relevant.forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    } else {
      sections.push('Search returned results but none contained specific complaints against this facility.')
      complaintResults.slice(0, 2).forEach((r, i) => {
        sections.push(`${i + 1}. ${r.title} \u2014 ${r.snippet}`)
      })
    }
  } else {
    sections.push('\u2705 No complaints, abuse reports, or warnings found in web search.')
  }

  // 2. News incidents
  const newsResults = await searchDDG(`"${facilityName}" ${location} news incident injury child`)
  sections.push('\n## News & Incidents')
  if (newsResults.length > 0) {
    const relevant = newsResults.filter(r =>
      /news|incident|injur|death|arrest|charged|investigation|emergency|ambulance|fire|recall/i.test(r.snippet)
    )
    if (relevant.length > 0) {
      sections.push('\u26a0\ufe0f **Found news mentions:**')
      relevant.forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    } else {
      sections.push('No concerning news articles found.')
    }
  } else {
    sections.push('No news incidents found (positive signal).')
  }

  // 3. State violation database search
  const violationResults = await searchDDG(`"${facilityName}" ${state} violation inspection deficiency daycare licensing`)
  sections.push('\n## Inspection Violations')
  if (violationResults.length > 0) {
    violationResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('No violation records found in web search. Check your state\'s licensing database directly for the most current data.')
  }

  // 4. BBB and consumer protection
  const bbbResults = await searchDDG(`site:bbb.org "${facilityName}" ${location}`)
  sections.push('\n## Better Business Bureau (BBB)')
  if (bbbResults.length > 0) {
    const bbbProfile = bbbResults.find(r => r.url.includes('bbb.org/us/'))
    if (bbbProfile) {
      sections.push(`\u2705 **BBB Profile found**: ${bbbProfile.url}`)
      sections.push(`   ${bbbProfile.snippet}`)
    } else {
      bbbResults.slice(0, 2).forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    }
  } else {
    sections.push('No BBB profile found. Many daycares are not BBB-listed \u2014 this is informational, not a red flag by itself.')
  }

  // 5. Owner/director background (if provided)
  if (ownerName) {
    const ownerResults = await searchDDG(`"${ownerName}" daycare childcare ${location} director owner`)
    sections.push(`\n## Director/Owner: ${ownerName}`)
    if (ownerResults.length > 0) {
      ownerResults.slice(0, 3).forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    } else {
      sections.push(`No web results found for "${ownerName}".`)
    }
  }

  // 6. Staff-to-child ratio and accreditation
  const accreditResults = await searchDDG(`"${facilityName}" ${location} NAEYC accredited ratio staff curriculum`)
  sections.push('\n## Accreditation & Quality Indicators')
  if (accreditResults.length > 0) {
    accreditResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('No NAEYC accreditation or quality rating mentions found. Only ~10% of childcare centers are NAEYC-accredited \u2014 absence is common but accreditation is a strong positive signal.')
  }

  // 7. Website quality check (if URL provided)
  if (websiteUrl) {
    sections.push(`\n## Website Check: ${websiteUrl}`)
    try {
      const res = await fetch(websiteUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DaycareTrustChecker/1.0)' },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        const html = await res.text()
        const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(html)
        const hasAddress = /\d+\s+\w+\s+(st|street|ave|avenue|blvd|boulevard|dr|drive|rd|road|ln|lane)/i.test(html)
        const hasLicense = /license|licensed|lic\s*#/i.test(html)
        const hasAccreditation = /NAEYC|accredit|quality\s*rat/i.test(html)
        const hasCurriculum = /curriculum|montessori|reggio|waldorf|play.?based|STEM/i.test(html)
        const hasStaffInfo = /staff|teacher|caregiver|director|qualif|credential|degree|CDA/i.test(html)

        sections.push(`- Phone number on site: ${hasPhone ? '\u2705 Yes' : '\u26a0\ufe0f Not found'}`)
        sections.push(`- Physical address on site: ${hasAddress ? '\u2705 Yes' : '\u26a0\ufe0f Not found'}`)
        sections.push(`- License mentioned: ${hasLicense ? '\u2705 Yes' : 'Not found'}`)
        sections.push(`- Accreditation mentioned: ${hasAccreditation ? '\u2705 Yes' : 'Not found'}`)
        sections.push(`- Curriculum info: ${hasCurriculum ? '\u2705 Yes' : 'Not found'}`)
        sections.push(`- Staff info: ${hasStaffInfo ? '\u2705 Yes' : '\u26a0\ufe0f Not found'}`)
      } else {
        sections.push(`Website returned HTTP ${res.status} \u2014 may be down or moved.`)
      }
    } catch (err) {
      sections.push(`Could not fetch website: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return sections.join('\n')
}
