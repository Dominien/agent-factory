import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import type { ToolDefinition } from '../types'

export const definition: ToolDefinition = {
  name: 'file_write',
  description:
    'Write content to a file in the output directory. Use this to save reports, summaries, or any generated content. Files are saved as markdown by default.',
  parameters: {
    type: 'object',
    properties: {
      filename: {
        type: 'string',
        description: 'Filename (e.g. "report.md", "summary.txt"). Saved to the ./output/ directory.',
      },
      content: {
        type: 'string',
        description: 'The content to write to the file',
      },
    },
    required: ['filename', 'content'],
  },
}

export async function execute(args: Record<string, unknown>): Promise<string> {
  const filename = args.filename as string
  const content = args.content as string

  if (!filename) return 'Error: filename is required'
  if (!content) return 'Error: content is required'

  // Prevent path traversal
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outputDir = join(process.cwd(), 'output')
  const filePath = join(outputDir, sanitized)

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, content, 'utf-8')
    return `File saved to output/${sanitized} (${content.length} characters)`
  } catch (err) {
    return `File write error: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}
