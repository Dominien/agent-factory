import { readFile } from 'fs/promises'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'file_read',
  description:
    'Read the contents of a file from disk. Use this to review previously saved reports, check configuration files, or read any local file the agent has access to.',
  parameters: {
    type: 'object',
    properties: {
      filepath: {
        type: 'string',
        description: 'The path to the file to read (absolute or relative to the working directory)',
      },
    },
    required: ['filepath'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filepath = args.filepath as string
  if (!filepath) return 'Error: filepath is required'

  try {
    const content = await readFile(filepath, 'utf-8')
    return content
  } catch (err) {
    return `File read error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
