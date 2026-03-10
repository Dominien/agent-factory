import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'fetch_company_profile',
  description:
    'Fetch a company\'s website and careers page to extract key information: what they do, their products/services, mission/values, team size indicators, and open roles. Use this as the first step when researching a company.',
  parameters: {
    type: 'object',
    properties: {
      company_name: {
        type: 'string',
        description: 'The name of the company to research',
      },
      website_url: {
        type: 'string',
        description: 'The company\'s website URL (optional — will search if not provided)',
      },
    },
    required: ['company_name'],
  },
}

async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompanyBriefing/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return ''

    const html = await res.text()
    const { Readability } = await import('@mozilla/readability')
    const { parseHTML } = await import('linkedom')
    const { document } = parseHTML(html)
    const reader = new Readability(document as unknown as Document)
    const article = reader.parse()

    if (article?.textContent) return article.textContent.trim().slice(0, 4000)

    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000)
  } catch {
    return ''
  }
}

async function searchDDG(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CompanyBriefing/1.0)' },
    })
    if (!res.ok) return []
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
      if (title && actualUrl) results.push({ title, url: actualUrl, snippet })
    }
    return results
  } catch {
    return []
  }
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const companyName = args.company_name as string
  let websiteUrl = args.website_url as string | undefined

  if (!companyName) return 'Error: company_name is required'

  const sections: string[] = []
  sections.push(`# Company Profile: ${companyName}\n`)

  // Find website if not provided
  if (!websiteUrl) {
    const searchResults = await searchDDG(`${companyName} official website`)
    if (searchResults.length > 0) {
      websiteUrl = searchResults[0].url
      sections.push(`**Website found**: ${websiteUrl}`)
    }
  }

  // Fetch main website
  if (websiteUrl) {
    const content = await fetchPage(websiteUrl)
    if (content) {
      sections.push(`\n## Website Content (${websiteUrl})`)
      sections.push(content.slice(0, 3000))
    } else {
      sections.push(`\n## Website\nCould not extract content from ${websiteUrl}`)
    }

    // Try to fetch /about page
    try {
      const aboutUrl = new URL('/about', websiteUrl).toString()
      const aboutContent = await fetchPage(aboutUrl)
      if (aboutContent && aboutContent.length > 200) {
        sections.push(`\n## About Page`)
        sections.push(aboutContent.slice(0, 2000))
      }
    } catch { /* ignore URL parse errors */ }
  }

  sections.push('\n---\nExtract: what the company does, products/services, mission, founding year, team size, tech stack if visible, and any notable achievements.')

  return sections.join('\n')
}
