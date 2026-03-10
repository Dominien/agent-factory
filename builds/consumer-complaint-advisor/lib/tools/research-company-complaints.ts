import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'research_company_complaints',
  description:
    'Research a company\'s complaint history and reputation by searching CFPB, BBB, state AG records, and general web sources. Returns complaint volume, common issues, response rates, and any enforcement actions. Use this to understand how the company handles complaints and which filing strategies are most effective.',
  parameters: {
    type: 'object',
    properties: {
      company_name: {
        type: 'string',
        description: 'Name of the company to research',
      },
      complaint_type: {
        type: 'string',
        description: 'Type of complaint to focus on (e.g. "billing", "refund", "service quality")',
      },
    },
    required: ['company_name'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const companyName = (args.company_name as string) || ''
  const complaintType = (args.complaint_type as string) || ''

  if (!companyName) {
    return 'Error: company_name is required'
  }

  const queries = [
    `"${companyName}" complaints CFPB consumer financial protection bureau`,
    `"${companyName}" BBB complaints rating reviews`,
    `"${companyName}" ${complaintType || 'complaints'} lawsuit settlement attorney general`,
    `"${companyName}" consumer complaints reddit ${complaintType}`,
  ]

  const allResults: string[] = []
  allResults.push(`## Company Complaint Research: ${companyName}`)
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
        // Determine source type from query
        let sourceLabel = 'Web'
        if (query.includes('CFPB')) sourceLabel = 'CFPB / Financial Complaints'
        else if (query.includes('BBB')) sourceLabel = 'BBB / Business Rating'
        else if (query.includes('attorney general')) sourceLabel = 'Legal Actions / Settlements'
        else if (query.includes('reddit')) sourceLabel = 'Consumer Forums / Reddit'

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
  allResults.push('- **High complaint volume** = The company has a pattern. Mention this in your complaint — agencies prioritize companies with many complaints.')
  allResults.push('- **AG settlements/lawsuits** = The company has been investigated before. Reference these in your complaint letter.')
  allResults.push('- **BBB rating** = Low BBB rating means the company doesn\'t respond to complaints there. Try government agencies instead.')
  allResults.push('- **Reddit patterns** = See what worked for other consumers. "I filed with CFPB and got a response in 3 days" = use CFPB.')
  allResults.push('')
  allResults.push('**Next**: Use `web_fetch` on the most relevant results to get detailed complaint data. Then use `write_resolution_plan` to generate your action plan.')

  return allResults.join('\n')
}
