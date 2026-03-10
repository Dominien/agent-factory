import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'composio_search_tools',
  description:
    'Search Composio\'s 250k+ tool catalog to discover API tools by description. Use this to find tool slugs and schemas before executing them. Example: "search reddit posts", "create github issue", "send slack message".',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Natural language description of what you need (e.g. "search reddit posts")',
      },
      toolkit: {
        type: 'string',
        description: 'Optional filter by toolkit name (e.g. "github", "reddit", "slack")',
      },
      limit: {
        type: 'number',
        description: 'Max results to return (default 5)',
      },
    },
    required: ['query'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const query = args.query as string
  if (!query) return 'Error: query is required'

  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return 'Error: COMPOSIO_API_KEY is not set. Add it to your .env file. Get one at https://composio.dev'
  }

  const limit = (args.limit as number) || 5
  const toolkit = args.toolkit as string | undefined

  const params = new URLSearchParams({
    query,
    limit: String(limit),
    toolkit_versions: 'latest',
  })
  if (toolkit) {
    params.set('toolkit_slugs', toolkit.toUpperCase())
  }

  try {
    const res = await fetch(
      `https://backend.composio.dev/api/v3/tools?${params.toString()}`,
      {
        headers: { 'x-api-key': apiKey },
      },
    )

    if (!res.ok) {
      return `Composio search failed (${res.status}): ${await res.text()}`
    }

    const data = await res.json()
    const tools = data.items || data.tools || data

    if (!Array.isArray(tools) || tools.length === 0) {
      return `No tools found for "${query}". Try a broader search.`
    }

    return tools
      .map((tool: Record<string, unknown>, i: number) => {
        const params = tool.parameters || tool.input_parameters
        const paramStr = params
          ? `\n   Parameters: ${JSON.stringify(params, null, 2).slice(0, 500)}`
          : ''
        return [
          `${i + 1}. **${tool.slug || tool.name}**`,
          `   Toolkit: ${tool.toolkit || 'unknown'}`,
          `   ${tool.description || 'No description'}`,
          `   Auth required: ${tool.auth_required ?? tool.requires_auth ?? 'unknown'}`,
          paramStr,
        ].join('\n')
      })
      .join('\n\n')
  } catch (err) {
    return `Composio search error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
