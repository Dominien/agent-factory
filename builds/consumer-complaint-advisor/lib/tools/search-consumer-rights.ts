import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_consumer_rights',
  description:
    'Search for state-specific consumer protection laws and rights relevant to the complaint. Searches for lemon laws, cooling-off periods, refund requirements, deceptive practices statutes, and other consumer protections in the specified state. Use AFTER analyze_complaint to find the legal basis for the complaint.',
  parameters: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'State to search consumer protection laws for (e.g. "California", "New York")',
      },
      complaint_type: {
        type: 'string',
        description: 'Type of complaint (e.g. "auto repair fraud", "subscription cancellation", "debt collection harassment", "defective product")',
      },
      specific_issue: {
        type: 'string',
        description: 'Specific issue to research (e.g. "cooling off period for door-to-door sales", "right to refund for defective goods")',
      },
    },
    required: ['state', 'complaint_type'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const state = (args.state as string) || ''
  const complaintType = (args.complaint_type as string) || ''
  const specificIssue = (args.specific_issue as string) || ''

  if (!state || !complaintType) {
    return 'Error: state and complaint_type are required'
  }

  // Build search queries
  const queries = [
    `${state} consumer protection law ${complaintType}`,
    `${state} attorney general consumer rights ${complaintType}`,
  ]
  if (specificIssue) {
    queries.push(`${state} ${specificIssue} consumer rights law`)
  }

  const allResults: string[] = []
  allResults.push(`## Consumer Rights Search: ${state} — ${complaintType}`)
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

  // Add universal consumer rights
  allResults.push('### Universal Consumer Rights (Federal)')
  allResults.push('- **FTC Act (Section 5)**: Prohibits unfair or deceptive acts or practices')
  allResults.push('- **Fair Credit Billing Act**: Right to dispute billing errors on credit cards within 60 days')
  allResults.push('- **Fair Debt Collection Practices Act**: Protects against harassing or deceptive debt collection')
  allResults.push('- **Magnuson-Moss Warranty Act**: Regulates product warranties and requires clear disclosure')
  allResults.push('- **CAN-SPAM Act**: Right to unsubscribe from commercial emails')
  allResults.push('- **Telephone Consumer Protection Act (TCPA)**: Restricts telemarketing calls and texts')
  allResults.push('- **FTC Cooling-Off Rule**: 3-day right to cancel door-to-door sales over $25')
  allResults.push('- **FTC Click-to-Cancel Rule (2025)**: Companies must make cancellation as easy as sign-up')
  allResults.push('- **Credit card chargeback rights**: You can dispute charges with your credit card company within 60 days for goods/services not delivered or materially different from what was promised')
  allResults.push('')
  allResults.push('**Next**: Use `web_fetch` on the most relevant results above to get full details on your state\'s specific consumer protection laws.')

  return allResults.join('\n')
}
