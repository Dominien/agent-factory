import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_data_brokers',
  description:
    'Search for data broker opt-out information. Finds opt-out pages, removal processes, and privacy policies for specific data brokers or categories. Use this to research how to remove data from a specific broker or find brokers in a category.',
  parameters: {
    type: 'object',
    properties: {
      broker_name: {
        type: 'string',
        description: 'Specific data broker name to search (e.g. "Spokeo", "BeenVerified", "WhitePages")',
      },
      category: {
        type: 'string',
        description: 'Category of data broker to search for (e.g. "people search sites", "background check sites", "marketing data brokers")',
      },
      state: {
        type: 'string',
        description: 'User\'s state — to find state-specific privacy rights and opt-out resources',
      },
    },
    required: [],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const brokerName = args.broker_name as string
  const category = args.category as string
  const state = args.state as string

  const queries: string[] = []

  if (brokerName) {
    queries.push(`${brokerName} opt out remove personal information 2025 2026`)
    queries.push(`${brokerName} privacy policy data removal request`)
  }

  if (category) {
    queries.push(`${category} opt out remove data free 2025`)
  }

  if (state) {
    queries.push(`${state} data broker opt out privacy rights 2025 2026`)
  }

  if (queries.length === 0) {
    queries.push('top data broker sites opt out remove personal information 2025 2026')
    queries.push('people search site opt out guide free 2025')
  }

  const allResults: string[] = []

  for (const query of queries) {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AgenticHarness/1.0)' },
      })

      if (!res.ok) continue

      const html = await res.text()
      const results: { title: string; url: string; snippet: string }[] = []
      const resultRegex =
        /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
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
        allResults.push(
          ...results.map(
            (r, i) => `${allResults.length + i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`
          )
        )
      }
    } catch {
      continue
    }
  }

  if (allResults.length === 0) {
    return 'No results found. Try searching with web_search for a specific data broker name + "opt out".'
  }

  const header = brokerName
    ? `## Search Results: ${brokerName} Opt-Out`
    : category
    ? `## Search Results: ${category} Opt-Out`
    : '## Data Broker Opt-Out Search Results'

  return `${header}\n\n${allResults.join('\n\n')}\n\n---\n**Tip**: Use \`web_fetch\` to read the most relevant opt-out pages above for detailed removal instructions.`
}
