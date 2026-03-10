import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'search_wage_laws',
  description:
    'Search for state-specific wage and overtime laws. Finds minimum wage, overtime rules, meal/rest break requirements, tip credit rules, and filing deadlines for a specific state. Use this after analyzing employment status to find applicable state laws.',
  parameters: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'State to search laws for (e.g. "California", "New York", "Texas")',
      },
      topics: {
        type: 'string',
        description: 'Specific topics to search for, comma-separated (e.g. "overtime rules, meal breaks, tip credit"). Defaults to all common topics.',
      },
    },
    required: ['state'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const state = args.state as string
  const topics = (args.topics as string) || 'overtime, minimum wage, meal breaks, wage theft filing'

  if (!state) return 'Error: state is required'

  const queries = [
    `${state} overtime laws employee rights 2025 2026`,
    `${state} minimum wage 2026 state labor department wage complaint`,
    `${state} ${topics} employee protections`,
  ]

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
    return `No results found for ${state} wage laws. Try searching directly with web_search for "${state} department of labor wage laws".`
  }

  return `## ${state} Wage Law Search Results\n\n${allResults.join('\n\n')}\n\n---\n**Tip**: Use \`web_fetch\` to read the most relevant pages above for detailed ${state} wage law information.`
}
