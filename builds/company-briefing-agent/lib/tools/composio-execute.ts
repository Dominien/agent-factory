import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'composio_execute_tool',
  description:
    'Execute a Composio tool by its slug. First use composio_search_tools to discover the slug and required parameters, then call this with the slug and arguments as a JSON string.',
  parameters: {
    type: 'object',
    properties: {
      tool_slug: {
        type: 'string',
        description: 'The tool slug from composio_search_tools (e.g. "GITHUB_CREATE_ISSUE")',
      },
      arguments: {
        type: 'string',
        description: 'JSON string of the tool\'s input arguments (e.g. \'{"owner":"user","repo":"my-repo","title":"Bug"}\')',
      },
      connected_account_id: {
        type: 'string',
        description: 'Optional connected account ID if the tool requires auth (get via composio_manage_connections)',
      },
    },
    required: ['tool_slug', 'arguments'],
  },
}

const MAX_RESULT_CHARS = 5000

export async function execute(args: Record<string, unknown>): Promise<string> {
  const toolSlug = args.tool_slug as string
  if (!toolSlug) return 'Error: tool_slug is required'

  const argsStr = args.arguments as string
  if (!argsStr) return 'Error: arguments is required (JSON string)'

  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return 'Error: COMPOSIO_API_KEY is not set. Add it to your .env file.'
  }

  let parsedArgs: Record<string, unknown>
  try {
    parsedArgs = JSON.parse(argsStr)
  } catch {
    return `Error: Invalid JSON in arguments: ${argsStr}`
  }

  const body: Record<string, unknown> = {
    arguments: parsedArgs,
    user_id: 'default',
  }

  const connectedAccountId = args.connected_account_id as string | undefined
  if (connectedAccountId) {
    body.connected_account_id = connectedAccountId
  }

  try {
    const res = await fetch(
      `https://backend.composio.dev/api/v3/tools/execute/${encodeURIComponent(toolSlug)}`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!res.ok) {
      const errText = await res.text()
      return `Composio execute failed (${res.status}): ${errText.slice(0, 1000)}`
    }

    const data = await res.json()

    if (data.error) {
      return `Tool error: ${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`
    }

    const result = JSON.stringify(data.data ?? data.response ?? data, null, 2)
    if (result.length > MAX_RESULT_CHARS) {
      return result.slice(0, MAX_RESULT_CHARS) + '\n... [truncated]'
    }
    return result
  } catch (err) {
    return `Composio execute error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
