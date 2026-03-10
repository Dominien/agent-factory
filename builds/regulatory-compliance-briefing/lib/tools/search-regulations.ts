import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_regulations',
  description:
    'Search for federal, state, and local regulations applicable to a specific business type and location. Returns relevant regulatory sources, requirements, and compliance obligations.',
  parameters: {
    type: 'object',
    properties: {
      business_type: {
        type: 'string',
        description: 'The type of business (e.g. "restaurant", "ecommerce store", "consulting firm", "construction company", "daycare center", "food truck")',
      },
      state: {
        type: 'string',
        description: 'The US state where the business operates (e.g. "California", "Texas", "New York")',
      },
      category: {
        type: 'string',
        description: 'Specific regulatory category to search (e.g. "employment law", "tax obligations", "licensing", "health and safety", "environmental"). Optional — if omitted, searches broadly.',
      },
    },
    required: ['business_type', 'state'],
  },
}

async function searchDDG(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ComplianceBriefing/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const html = await res.text()
    const results: { title: string; url: string; snippet: string }[] = []
    const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
    let match
    while ((match = resultRegex.exec(html)) !== null && results.length < 6) {
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
  const businessType = args.business_type as string
  const state = args.state as string
  const category = args.category as string | undefined

  if (!businessType || !state) return 'Error: business_type and state are required'

  const sections: string[] = []
  sections.push(`# Regulatory Search: ${businessType} in ${state}${category ? ` — ${category}` : ''}\n`)

  // Build targeted search queries
  const queries: string[] = []
  if (category) {
    queries.push(`${state} ${category} requirements ${businessType} small business 2025 2026`)
    queries.push(`${businessType} ${category} compliance ${state} regulations`)
  } else {
    queries.push(`${businessType} business license requirements ${state} 2025 2026`)
    queries.push(`${state} small business regulations compliance checklist ${businessType}`)
    queries.push(`SBA ${businessType} business requirements federal state ${state}`)
  }

  const allResults: { title: string; url: string; snippet: string }[] = []
  for (const query of queries) {
    const results = await searchDDG(query)
    allResults.push(...results)
  }

  if (allResults.length === 0) {
    return `No regulatory information found for "${businessType}" in ${state}${category ? ` (${category})` : ''}. Try different search terms or a broader category.`
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = allResults.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })

  sections.push(`## Search Results (${unique.length} sources)\n`)
  for (const r of unique.slice(0, 10)) {
    sections.push(`### ${r.title}`)
    sections.push(`Source: ${r.url}`)
    sections.push(`${r.snippet}\n`)
  }

  sections.push('---')
  sections.push('Use fetch_regulatory_details or web_fetch on the most relevant government pages to extract specific requirements, deadlines, and compliance steps.')

  return sections.join('\n')
}
