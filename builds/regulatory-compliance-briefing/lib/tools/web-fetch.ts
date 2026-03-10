import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'web_fetch',
  description:
    'Fetch a web page and extract its readable content. Use this after web_search to read the full content of a relevant result. Returns the page title and main text content.',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to fetch',
      },
    },
    required: ['url'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const url = args.url as string
  if (!url) return 'Error: url is required'

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgenticHarness/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return `Failed to fetch ${url}: HTTP ${res.status}`
    }

    const html = await res.text()

    // Use @mozilla/readability + linkedom for content extraction
    const { Readability } = await import('@mozilla/readability')
    const { parseHTML } = await import('linkedom')

    const { document } = parseHTML(html)
    const reader = new Readability(document as unknown as Document)
    const article = reader.parse()

    if (!article || !article.textContent?.trim()) {
      // Fallback: extract text from body
      const bodyText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000)

      return `**Page content from ${url}:**\n\n${bodyText || 'Could not extract content from this page.'}`
    }

    const content = article.textContent.trim().slice(0, 8000)
    return `**${article.title}**\n\nSource: ${url}\n\n${content}`
  } catch (err) {
    return `Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
