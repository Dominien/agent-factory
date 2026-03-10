import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'fetch_regulatory_details',
  description:
    'Fetch a government or regulatory website page and extract specific compliance requirements, deadlines, penalties, and filing instructions. Optimized for government sites (SBA.gov, IRS.gov, state agency sites).',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL of the government/regulatory page to fetch',
      },
      focus: {
        type: 'string',
        description: 'What to focus on when extracting info (e.g. "license requirements", "filing deadlines", "penalties", "employee count thresholds")',
      },
    },
    required: ['url'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const url = args.url as string
  const focus = (args.focus as string) || 'compliance requirements'

  if (!url) return 'Error: url is required'

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ComplianceBriefing/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return `Failed to fetch ${url}: HTTP ${res.status}`
    }

    const html = await res.text()

    // Try Readability first
    try {
      const { Readability } = await import('@mozilla/readability')
      const { parseHTML } = await import('linkedom')
      const { document } = parseHTML(html)
      const reader = new Readability(document as unknown as Document)
      const article = reader.parse()

      if (article?.textContent) {
        const content = article.textContent.trim().slice(0, 5000)
        return `# Regulatory Details from ${url}\n**Focus**: ${focus}\n\n${content}\n\n---\nExtract specific ${focus} from this content. Note deadlines, penalties, thresholds, and filing requirements.`
      }
    } catch {
      // Readability failed, fall back to basic HTML parsing
    }

    // Fallback: strip HTML tags
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000)

    return `# Regulatory Details from ${url}\n**Focus**: ${focus}\n\n${text}\n\n---\nExtract specific ${focus} from this content.`
  } catch (err) {
    return `Fetch error for ${url}: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
