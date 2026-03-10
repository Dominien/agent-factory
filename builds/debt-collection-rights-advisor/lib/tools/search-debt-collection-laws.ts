import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_debt_collection_laws',
  description:
    'Search for state-specific debt collection laws, recent CFPB rules, and consumer protection regulations beyond the federal FDCPA. Use AFTER analyze_debt_situation to get detailed, up-to-date information about the consumer\'s state-specific rights.',
  parameters: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'State to research debt collection laws for (e.g. "California", "TX")',
      },
      topic: {
        type: 'string',
        description: 'Specific topic to research (e.g. "statute of limitations credit card", "wage garnishment exemptions", "debt collection licensing requirements")',
      },
      debt_type: {
        type: 'string',
        description: 'Type of debt for targeted research (e.g. "medical", "credit_card", "student_loan")',
      },
    },
    required: ['state', 'topic'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const state = (args.state as string) || ''
  const topic = (args.topic as string) || ''
  const debtType = (args.debt_type as string) || ''

  if (!state || !topic) {
    return 'Error: state and topic are required'
  }

  const queries: string[] = [
    `${state} debt collection laws consumer protection ${topic} 2025 2026`,
    `${state} FDCPA state law debt collector rights ${topic}`,
    `${state} ${debtType ? debtType + ' ' : ''}debt collection statute of limitations consumer rights`,
    `CFPB Regulation F debt collection rules ${topic} 2025`,
  ]

  const allResults: string[] = []
  allResults.push(`## Debt Collection Law Search: ${state}`)
  allResults.push(`**Topic**: ${topic}`)
  if (debtType) allResults.push(`**Debt type**: ${debtType}`)
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
        if (query.includes('consumer protection')) sourceLabel = 'State Consumer Protection Laws'
        else if (query.includes('FDCPA state law')) sourceLabel = 'FDCPA & State Laws'
        else if (query.includes('statute of limitations')) sourceLabel = 'Statute of Limitations'
        else if (query.includes('CFPB')) sourceLabel = 'CFPB / Regulation F'

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

  allResults.push('### Key Federal Resources')
  allResults.push('- **CFPB Debt Collection Page**: https://www.consumerfinance.gov/consumer-tools/debt-collection/')
  allResults.push('- **CFPB Complaint Portal**: https://www.consumerfinance.gov/complaint/')
  allResults.push('- **FTC Debt Collection FAQ**: https://consumer.ftc.gov/articles/debt-collection-faqs')
  allResults.push('- **FDCPA Full Text**: https://www.law.cornell.edu/uscode/text/15/chapter-41/subchapter-V')
  allResults.push('- **Regulation F (CFPB Rules)**: https://www.consumerfinance.gov/rules-policy/final-rules/debt-collection-practices-regulation-f/')
  allResults.push('')
  allResults.push('**Next**: Use `web_fetch` on the most relevant results to get full details, then use `write_dispute_letter` to generate your dispute strategy.')

  return allResults.join('\n')
}
