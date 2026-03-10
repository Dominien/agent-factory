import { runAgent } from '@/lib/orchestrator'
import { registerTool } from '@/lib/tools/registry'
import type { ChatMessage } from '@/lib/types'

// Register tools on first import
import * as analyzeEmployment from '@/lib/tools/analyze-employment'
import * as searchWageLaws from '@/lib/tools/search-wage-laws'
import * as calculateOwedWages from '@/lib/tools/calculate-owed-wages'
import * as writeWageReport from '@/lib/tools/write-wage-report'
import * as webSearch from '@/lib/tools/web-search'
import * as webFetch from '@/lib/tools/web-fetch'
import * as fileWrite from '@/lib/tools/file-write'
import * as fileRead from '@/lib/tools/file-read'
import * as composioSearch from '@/lib/tools/composio-search'
import * as composioExecute from '@/lib/tools/composio-execute'
import * as composioConnections from '@/lib/tools/composio-connections'

let toolsRegistered = false
function ensureTools() {
  if (toolsRegistered) return
  registerTool(analyzeEmployment)
  registerTool(searchWageLaws)
  registerTool(calculateOwedWages)
  registerTool(writeWageReport)
  registerTool(webSearch)
  registerTool(webFetch)
  registerTool(fileWrite)
  registerTool(fileRead)
  registerTool(composioSearch)
  registerTool(composioExecute)
  registerTool(composioConnections)
  toolsRegistered = true
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const messages = body.messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing "messages" array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  ensureTools()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runAgent(messages)) {
          const data = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(data))
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Stream error'
        const data = `data: ${JSON.stringify({ type: 'error', error: errorMsg })}\n\n`
        controller.enqueue(encoder.encode(data))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
