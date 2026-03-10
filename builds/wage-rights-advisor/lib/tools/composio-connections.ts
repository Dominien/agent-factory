import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'composio_manage_connections',
  description:
    'Check or initiate Composio auth connections. Use action "check" to see active connections for a toolkit, or "initiate" to start a new OAuth/API key connection.',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: '"check" to list active connections, "initiate" to start a new connection',
        enum: ['check', 'initiate'],
      },
      toolkit: {
        type: 'string',
        description: 'Toolkit slug to filter by (e.g. "github", "reddit", "slack")',
      },
      auth_config_id: {
        type: 'string',
        description: 'Auth config ID (required for "initiate" action)',
      },
      user_id: {
        type: 'string',
        description: 'User ID for the connection (default: "default")',
      },
    },
    required: ['action'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const action = args.action as string
  if (!action || !['check', 'initiate'].includes(action)) {
    return 'Error: action must be "check" or "initiate"'
  }

  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    return 'Error: COMPOSIO_API_KEY is not set. Add it to your .env file.'
  }

  const toolkit = args.toolkit as string | undefined
  const userId = (args.user_id as string) || 'default'

  try {
    if (action === 'check') {
      const params = new URLSearchParams({ statuses: 'ACTIVE' })
      if (toolkit) {
        params.set('toolkit_slugs', toolkit.toUpperCase())
      }

      const res = await fetch(
        `https://backend.composio.dev/api/v3/connected_accounts?${params.toString()}`,
        {
          headers: { 'x-api-key': apiKey },
        },
      )

      if (!res.ok) {
        return `Composio connections check failed (${res.status}): ${await res.text()}`
      }

      const data = await res.json()
      const accounts = data.items || data.connected_accounts || data

      if (!Array.isArray(accounts) || accounts.length === 0) {
        return toolkit
          ? `No active connections for toolkit "${toolkit}". Use action "initiate" to set one up.`
          : 'No active connections found. Use action "initiate" to set one up.'
      }

      return accounts
        .map(
          (acc: Record<string, unknown>, i: number) =>
            `${i + 1}. **${acc.toolkit || acc.app_name || 'unknown'}**\n   ID: ${acc.id || acc.connected_account_id}\n   Auth: ${acc.auth_scheme || acc.authentication_type || 'unknown'}\n   Status: ${acc.status || 'active'}`,
        )
        .join('\n\n')
    }

    // action === 'initiate'
    const authConfigId = args.auth_config_id as string
    if (!authConfigId) {
      return 'Error: auth_config_id is required for "initiate" action. Use "check" first to find available auth configs.'
    }

    const res = await fetch(
      'https://backend.composio.dev/api/v3/connected_accounts',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_config: { id: authConfigId },
          connection: { user_id: userId },
        }),
      },
    )

    if (!res.ok) {
      return `Composio initiate connection failed (${res.status}): ${await res.text()}`
    }

    const data = await res.json()
    const parts = [`Connection initiated successfully.`]
    if (data.connected_account_id || data.id) {
      parts.push(`Connected Account ID: ${data.connected_account_id || data.id}`)
    }
    if (data.redirect_url || data.redirectUrl) {
      parts.push(`OAuth redirect URL: ${data.redirect_url || data.redirectUrl}`)
    }
    return parts.join('\n')
  } catch (err) {
    return `Composio connection error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
