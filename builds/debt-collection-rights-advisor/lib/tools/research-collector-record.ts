import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'research_collector_record',
  description:
    'Research a debt collection agency\'s complaint history, CFPB records, BBB rating, and enforcement actions. Use this to understand how the collector typically operates and whether they have a pattern of violations. Strengthens your dispute by showing the collector\'s track record.',
  parameters: {
    type: 'object',
    properties: {
      collector_name: {
        type: 'string',
        description: 'Name of the debt collection agency to research',
      },
      violation_type: {
        type: 'string',
        description: 'Type of violation to focus research on (e.g. "harassment", "false threats", "validation notice")',
      },
    },
    required: ['collector_name'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const collector = (args.collector_name as string) || ''
  const violationType = (args.violation_type as string) || 'complaints'

  if (!collector) {
    return 'Error: collector_name is required'
  }

  const queries = [
    `"${collector}" CFPB complaints debt collection violations`,
    `"${collector}" BBB rating reviews debt collector`,
    `"${collector}" ${violationType} consumer complaints reddit`,
    `"${collector}" FTC enforcement action state attorney general`,
  ]

  const allResults: string[] = []
  allResults.push(`## Collection Agency Research: ${collector}`)
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
        if (query.includes('CFPB')) sourceLabel = 'CFPB / Official Complaints'
        else if (query.includes('BBB')) sourceLabel = 'BBB / Reviews'
        else if (query.includes('reddit')) sourceLabel = 'Consumer Forums'
        else if (query.includes('FTC')) sourceLabel = 'Enforcement Actions'

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
  allResults.push(`- **High CFPB complaint volume**: ${collector} has a pattern of violations. Your complaint carries more weight — regulators notice repeat offenders.`)
  allResults.push('- **BBB complaints**: Document consumer experiences. If many report similar violations to yours, it strengthens your case.')
  allResults.push('- **FTC/AG enforcement**: Prior enforcement actions show the collector has been sanctioned before. Mention this in your dispute letter.')
  allResults.push('- **Consumer forum reports**: Learn what strategies worked for others dealing with this collector.')
  allResults.push('')
  allResults.push('**Next**: Use `write_dispute_letter` to generate your personalized dispute strategy incorporating this research.')

  return allResults.join('\n')
}
