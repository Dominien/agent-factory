import { runAgent } from '@/lib/orchestrator'
import { registerTool } from '@/lib/tools/registry'
import type { ChatMessage } from '@/lib/types'

// Register specialized company briefing tools
import * as fetchCompanyProfile from '@/lib/tools/fetch-company-profile'
import * as researchReputation from '@/lib/tools/research-company-reputation'
import * as writeBriefing from '@/lib/tools/write-briefing'

let toolsRegistered = false
function ensureTools() {
  if (toolsRegistered) return
  registerTool(fetchCompanyProfile)
  registerTool(researchReputation)
  registerTool(writeBriefing)
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
