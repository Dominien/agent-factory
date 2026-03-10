import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_airline_rights',
  description:
    'Search for current airline passenger rights regulations, recent DOT rule changes, EU261 updates, and airline-specific policies. Use AFTER analyze_flight_disruption to get detailed, up-to-date information about applicable regulations.',
  parameters: {
    type: 'object',
    properties: {
      regulation: {
        type: 'string',
        description: 'Which regulation to research: "US_DOT", "EU261", "CANADA_APPR", or "all"',
      },
      disruption_type: {
        type: 'string',
        description: 'Type of disruption to research (e.g. "flight cancellation refund", "delay compensation", "denied boarding")',
      },
      airline: {
        type: 'string',
        description: 'Specific airline to research policies for (optional)',
      },
    },
    required: ['disruption_type'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const regulation = (args.regulation as string) || 'all'
  const disruptionType = (args.disruption_type as string) || ''
  const airline = (args.airline as string) || ''

  if (!disruptionType) {
    return 'Error: disruption_type is required'
  }

  const queries: string[] = []

  if (regulation === 'US_DOT' || regulation === 'all') {
    queries.push(`US DOT airline passenger rights ${disruptionType} 2025 2026 rules`)
  }
  if (regulation === 'EU261' || regulation === 'all') {
    queries.push(`EU261 regulation ${disruptionType} compensation rights 2025 2026`)
  }
  if (regulation === 'CANADA_APPR' || regulation === 'all') {
    queries.push(`Canada APPR air passenger protection ${disruptionType} rights`)
  }
  if (airline) {
    queries.push(`${airline} ${disruptionType} policy compensation refund`)
  }

  const allResults: string[] = []
  allResults.push(`## Airline Rights Search: ${disruptionType}`)
  if (airline) allResults.push(`**Airline**: ${airline}`)
  allResults.push('')

  for (const query of queries) {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AgenticHarness/1.0)' },
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) continue

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

        if (title && actualUrl) {
          results.push({ title, url: actualUrl, snippet })
        }
      }

      if (results.length > 0) {
        allResults.push(`### Search: "${query}"`)
        results.forEach((r, i) => {
          allResults.push(`${i + 1}. **${r.title}**`)
          allResults.push(`   ${r.url}`)
          allResults.push(`   ${r.snippet}`)
        })
        allResults.push('')
      }
    } catch {
      // Skip failed searches
    }
  }

  allResults.push('### Key Resources')
  allResults.push('- **US DOT Airline Consumer Protection**: https://www.transportation.gov/airconsumer')
  allResults.push('- **US DOT Cancellation Dashboard**: https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard')
  allResults.push('- **EU261 Official Text**: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32004R0261')
  allResults.push('- **Canadian APPR**: https://otc-cta.gc.ca/eng/air-passenger-protection')
  allResults.push('- **DOT Complaint Form**: https://airconsumer.dot.gov/escomplaint/ConsumerForm.cfm')
  allResults.push('')
  allResults.push('**Next**: Use `web_fetch` on the most relevant results to get full regulatory details.')

  return allResults.join('\n')
}
