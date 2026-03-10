import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'research_company_reputation',
  description:
    'Research a company\'s reputation, recent news, Glassdoor reviews, funding history, and key people. Searches multiple sources to build a comprehensive picture for interview preparation.',
  parameters: {
    type: 'object',
    properties: {
      company_name: {
        type: 'string',
        description: 'The name of the company to research',
      },
      role_title: {
        type: 'string',
        description: 'The job role you\'re interviewing for (optional — helps tailor the briefing)',
      },
    },
    required: ['company_name'],
  },
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
  const roleTitle = args.role_title as string | undefined

  if (!companyName) return 'Error: company_name is required'

  const sections: string[] = []
  sections.push(`# Reputation Research: ${companyName}\n`)

  // Search 1: Recent news
  const newsResults = await searchDDG(`"${companyName}" news 2026 OR 2025`)
  if (newsResults.length > 0) {
    sections.push('## Recent News')
    newsResults.forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('## Recent News\nNo recent news found.')
  }

  // Search 2: Glassdoor reviews
  const reviewResults = await searchDDG(`"${companyName}" glassdoor reviews employees culture`)
  if (reviewResults.length > 0) {
    sections.push('\n## Employee Reviews')
    reviewResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('\n## Employee Reviews\nNo Glassdoor or review data found.')
  }

  // Search 3: Funding and investors
  const fundingResults = await searchDDG(`"${companyName}" funding raised investors crunchbase`)
  if (fundingResults.length > 0) {
    sections.push('\n## Funding & Investors')
    fundingResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  }

  // Search 4: Key people / leadership
  const leadershipResults = await searchDDG(`"${companyName}" CEO founder leadership team`)
  if (leadershipResults.length > 0) {
    sections.push('\n## Leadership')
    leadershipResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  }

  // Search 5: Role-specific info if provided
  if (roleTitle) {
    const roleResults = await searchDDG(`"${companyName}" "${roleTitle}" interview experience`)
    if (roleResults.length > 0) {
      sections.push(`\n## Interview Insights for ${roleTitle}`)
      roleResults.slice(0, 3).forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    }
  }

  return sections.join('\n')
}
