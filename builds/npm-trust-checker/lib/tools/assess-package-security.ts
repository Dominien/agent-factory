import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'assess_package_security',
  description:
    'Assess the security posture of an npm package by checking its GitHub repository health, searching for known vulnerabilities (CVEs), and looking for reports of malicious behavior or typosquatting. Use after check_npm_registry.',
  parameters: {
    type: 'object',
    properties: {
      package_name: {
        type: 'string',
        description: 'The npm package name',
      },
      repo_url: {
        type: 'string',
        description: 'The GitHub repository URL from the npm registry data',
      },
    },
    required: ['package_name'],
  },
}

async function searchDDG(query: string): Promise<{ title: string; url: string; snippet: string }[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NpmTrustChecker/1.0)' },
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

async function fetchJSON(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NpmTrustChecker/1.0', Accept: 'application/vnd.github.v3+json' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const packageName = args.package_name as string
  const repoUrl = args.repo_url as string | undefined

  if (!packageName) return 'Error: package_name is required'

  const sections: string[] = []
  sections.push(`# Security Assessment: ${packageName}\n`)

  // 1. Check for known vulnerabilities
  const vulnResults = await searchDDG(`"${packageName}" npm vulnerability CVE security advisory`)
  if (vulnResults.length > 0) {
    sections.push('## Known Vulnerabilities')
    vulnResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  } else {
    sections.push('## Known Vulnerabilities\nNo specific CVE reports found in web search (positive signal).')
  }

  // 2. Check for malicious/typosquatting reports
  const malwareResults = await searchDDG(`"${packageName}" npm malicious malware typosquatting supply chain`)
  if (malwareResults.length > 0) {
    const relevant = malwareResults.filter(r =>
      r.title.toLowerCase().includes(packageName.toLowerCase()) ||
      r.snippet.toLowerCase().includes(packageName.toLowerCase())
    )
    if (relevant.length > 0) {
      sections.push('\n## Malware / Typosquatting Reports')
      sections.push('⚠️ **Found reports mentioning this package name in a security context:**')
      relevant.forEach((r, i) => {
        sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
      })
    } else {
      sections.push('\n## Malware Reports\nNo malware reports found specifically for this package (positive signal).')
    }
  }

  // 3. Check GitHub repo health if URL available
  if (repoUrl) {
    const repoMatch = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
    if (repoMatch) {
      const owner = repoMatch[1]
      const repo = repoMatch[2]

      sections.push(`\n## GitHub Repository: ${owner}/${repo}`)

      const repoData = await fetchJSON(`https://api.github.com/repos/${owner}/${repo}`) as Record<string, unknown> | null
      if (repoData) {
        sections.push(`- **Stars**: ${repoData.stargazers_count}`)
        sections.push(`- **Forks**: ${repoData.forks_count}`)
        sections.push(`- **Open Issues**: ${repoData.open_issues_count}`)
        sections.push(`- **Last Push**: ${repoData.pushed_at}`)
        sections.push(`- **Archived**: ${repoData.archived}`)
        sections.push(`- **License**: ${(repoData.license as Record<string, unknown>)?.spdx_id || 'None'}`)

        if (repoData.archived) {
          sections.push('- ⚠️ **Repository is ARCHIVED** — no longer maintained')
        }

        const pushedAt = repoData.pushed_at as string
        if (pushedAt) {
          const daysSincePush = Math.floor((Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24))
          if (daysSincePush > 365) {
            sections.push(`- ⚠️ **No activity in ${daysSincePush} days** — possibly abandoned`)
          } else if (daysSincePush > 180) {
            sections.push(`- ⚠️ **Limited activity** (${daysSincePush} days since last push)`)
          }
        }
      } else {
        sections.push('- ⚠️ Could not fetch repository data — repo may be private, deleted, or URL is incorrect')
      }
    }
  } else {
    sections.push('\n## GitHub Repository\n⚠️ No repository URL found — cannot verify source code.')
  }

  // 4. Check for community trust signals
  const communityResults = await searchDDG(`"${packageName}" npm package review recommended alternative`)
  if (communityResults.length > 0) {
    sections.push('\n## Community Signals')
    communityResults.slice(0, 3).forEach((r, i) => {
      sections.push(`${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet}`)
    })
  }

  return sections.join('\n')
}
