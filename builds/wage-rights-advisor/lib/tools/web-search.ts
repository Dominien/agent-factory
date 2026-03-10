import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'web_search',
  description:
    'Search the web for information on a topic. Returns a list of results with titles, URLs, and snippets. Use this to find sources before reading them with web_fetch.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
    },
    required: ['query'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const query = args.query as string
  if (!query) return 'Error: query is required'

  // Use DuckDuckGo HTML search (no API key needed)
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgenticHarness/1.0)',
      },
    })

    if (!res.ok) {
      return `Search failed with status ${res.status}`
    }

    const html = await res.text()

    // Parse results from DDG HTML response
    const results: { title: string; url: string; snippet: string }[] = []
    const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
    let match

    while ((match = resultRegex.exec(html)) !== null && results.length < 8) {
      const rawUrl = match[1]
      const title = match[2].replace(/<[^>]*>/g, '').trim()
      const snippet = match[3].replace(/<[^>]*>/g, '').trim()

      // DDG wraps URLs in a redirect — extract the actual URL
      const urlMatch = rawUrl.match(/uddg=([^&]+)/)
      const actualUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : rawUrl

      if (title && actualUrl) {
        results.push({ title, url: actualUrl, snippet })
      }
    }

    if (results.length === 0) {
      return `No results found for "${query}".`
    }

    return results
      .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      .join('\n\n')
  } catch (err) {
    return `Search error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
