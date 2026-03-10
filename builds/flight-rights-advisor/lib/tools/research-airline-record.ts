import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'research_airline_record',
  description:
    'Research an airline\'s complaint history, on-time performance, and reputation for handling disruptions. Searches DOT complaint data, consumer reviews, and news about the airline\'s customer service track record. Use this to understand how likely the airline is to honor your claim.',
  parameters: {
    type: 'object',
    properties: {
      airline: {
        type: 'string',
        description: 'Name of the airline to research',
      },
      disruption_type: {
        type: 'string',
        description: 'Type of disruption to focus research on (e.g. "cancellation refunds", "delay compensation")',
      },
    },
    required: ['airline'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const airline = (args.airline as string) || ''
  const disruptionType = (args.disruption_type as string) || 'complaints'

  if (!airline) {
    return 'Error: airline is required'
  }

  const queries = [
    `"${airline}" DOT complaints consumer protection airline ranking 2025`,
    `"${airline}" on-time performance cancellation rate statistics`,
    `"${airline}" ${disruptionType} customer complaints reddit reviews`,
    `"${airline}" refund compensation policy response time`,
  ]

  const allResults: string[] = []
  allResults.push(`## Airline Record Research: ${airline}`)
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

      while ((match = resultRegex.exec(html)) !== null && results.length < 4) {
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
        let sourceLabel = 'Web'
        if (query.includes('DOT complaints')) sourceLabel = 'DOT / Official Complaints'
        else if (query.includes('on-time')) sourceLabel = 'Performance Data'
        else if (query.includes('reddit')) sourceLabel = 'Consumer Forums'
        else if (query.includes('refund')) sourceLabel = 'Refund/Compensation Policies'

        allResults.push(`### ${sourceLabel}`)
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

  allResults.push('### How to Use This Research')
  allResults.push('- **High DOT complaint volume**: The airline has a pattern of poor customer service. File a DOT complaint — it carries weight.')
  allResults.push('- **Poor on-time performance**: Delays are likely systematic, not extraordinary. Strengthens your claim.')
  allResults.push('- **Slow refund processing**: Be persistent. Set deadlines in your claim letter and escalate if not met.')
  allResults.push('- **Positive Reddit reports**: Learn what worked for other passengers (e.g., "I emailed the CEO and got a response in 2 days").')
  allResults.push('')
  allResults.push('**Next**: Use `write_claim_plan` to generate your complete claim with letters and filing instructions.')

  return allResults.join('\n')
}
