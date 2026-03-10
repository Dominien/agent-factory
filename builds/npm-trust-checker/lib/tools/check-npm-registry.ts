import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'check_npm_registry',
  description:
    'Fetch comprehensive metadata about an npm package from the registry: download counts, version history, maintainers, publish dates, repository URL, license, and dependencies. This data reveals age, popularity, and maintenance patterns.',
  parameters: {
    type: 'object',
    properties: {
      package_name: {
        type: 'string',
        description: 'The npm package name to check (e.g. "express", "lodash", "@types/node")',
      },
    },
    required: ['package_name'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const packageName = args.package_name as string
  if (!packageName) return 'Error: package_name is required'

  const sections: string[] = []
  sections.push(`# npm Registry Check: ${packageName}\n`)

  // Fetch package metadata from npm registry
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      if (res.status === 404) {
        return `Package "${packageName}" not found on npm. This could be a typo — check the spelling carefully. Typosquatting attacks use names similar to popular packages.`
      }
      return `npm registry returned HTTP ${res.status} for "${packageName}".`
    }

    const data = await res.json() as Record<string, unknown>

    // Basic info
    const distTags = data['dist-tags'] as Record<string, string> | undefined
    const latestVersion = distTags?.latest || 'unknown'
    const time = data.time as Record<string, string> | undefined
    const created = time?.created || 'unknown'
    const lastModified = time?.modified || 'unknown'
    const lastPublish = time?.[latestVersion] || 'unknown'
    const license = data.license as string || 'NONE'
    const description = data.description as string || 'No description'
    const repository = data.repository as Record<string, string> | undefined
    const repoUrl = repository?.url || 'None'

    // Maintainers
    const maintainers = data.maintainers as Array<{ name: string; email?: string }> | undefined
    const maintainerCount = maintainers?.length || 0

    // Version count
    const versions = data.versions as Record<string, unknown> | undefined
    const versionCount = versions ? Object.keys(versions).length : 0

    // Get latest version details for dependency count
    const latestData = versions?.[latestVersion] as Record<string, unknown> | undefined
    const deps = latestData?.dependencies as Record<string, string> | undefined
    const depCount = deps ? Object.keys(deps).length : 0

    // Check for install scripts (potential risk)
    const scripts = (latestData?.scripts as Record<string, string>) || {}
    const hasInstallScript = !!(scripts.preinstall || scripts.install || scripts.postinstall)

    sections.push('## Package Info')
    sections.push(`- **Description**: ${description}`)
    sections.push(`- **Latest Version**: ${latestVersion}`)
    sections.push(`- **License**: ${license}`)
    sections.push(`- **Repository**: ${repoUrl}`)
    sections.push(`- **Created**: ${created}`)
    sections.push(`- **Last Modified**: ${lastModified}`)
    sections.push(`- **Last Published**: ${lastPublish}`)
    sections.push(`- **Total Versions**: ${versionCount}`)
    sections.push(`- **Dependencies**: ${depCount}`)
    sections.push(`- **Maintainers**: ${maintainerCount}`)
    if (maintainers) {
      maintainers.slice(0, 5).forEach(m => {
        sections.push(`  - ${m.name}${m.email ? ` (${m.email})` : ''}`)
      })
    }

    // Risk signals
    sections.push('\n## Risk Signals')
    if (hasInstallScript) {
      sections.push('- ⚠️ **HAS INSTALL SCRIPTS** (preinstall/install/postinstall) — these run automatically and can execute arbitrary code')
    }
    if (license === 'NONE') {
      sections.push('- ⚠️ **No license specified** — legal risk')
    }
    if (maintainerCount <= 1) {
      sections.push('- ⚠️ **Single maintainer** — bus factor of 1')
    }
    if (versionCount <= 2) {
      sections.push('- ⚠️ **Very few versions** — package may be new/experimental')
    }
    if (repoUrl === 'None') {
      sections.push('- ⚠️ **No repository URL** — cannot verify source code')
    }

    // Check age
    if (created && created !== 'unknown') {
      const ageMs = Date.now() - new Date(created).getTime()
      const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24))
      if (ageDays < 30) {
        sections.push(`- ⚠️ **Very new package** (${ageDays} days old) — new packages have higher malware risk`)
      }
      sections.push(`- Package age: ${ageDays} days`)
    }
  } catch (err) {
    sections.push(`Registry error: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }

  // Fetch download counts
  try {
    const dlRes = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`, {
      signal: AbortSignal.timeout(5000),
    })
    if (dlRes.ok) {
      const dlData = await dlRes.json() as { downloads: number }
      sections.push(`\n## Downloads`)
      sections.push(`- **Weekly downloads**: ${dlData.downloads.toLocaleString()}`)
      if (dlData.downloads < 100) {
        sections.push('- ⚠️ **Very low download count** — minimal community validation')
      } else if (dlData.downloads < 1000) {
        sections.push('- ⚠️ **Low download count** — limited community use')
      }
    }
  } catch { /* ignore download fetch errors */ }

  return sections.join('\n')
}
