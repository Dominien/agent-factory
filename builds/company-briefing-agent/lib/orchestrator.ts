import type { AgentStreamEvent, ChatMessage, ToolCall, ToolResult, StreamChunk } from './types'
import { createProvider } from './provider-factory'
import { getTool, getToolDefinitions } from './tools/registry'
import { agentConfig } from '../config'

/**
 * Core agentic orchestration loop.
 *
 * Takes a conversation history and streams back events as the agent thinks,
 * calls tools, and generates responses. The loop continues until the LLM
 * stops calling tools or hits the max rounds limit.
 *
 * Architecture:
 *   user message → LLM call → tool calls → execute tools → append results → repeat
 */
export async function* runAgent(
  history: ChatMessage[],
): AsyncGenerator<AgentStreamEvent> {
  try {
    const provider = createProvider()
    const toolDefinitions = getToolDefinitions()
    const { maxRounds, maxToolResultChars, systemPrompt } = agentConfig

    let totalPromptTokens = 0
    let totalCompletionTokens = 0

    // Agent loop — stream LLM, execute tool calls, repeat
    for (let round = 0; round < maxRounds; round++) {
      yield { type: 'round', round: round + 1, maxRounds }

      let assistantContent = ''
      const toolCalls: ToolCall[] = []
      const pendingToolCalls = new Map<string, { id: string; name: string; args: string }>()
      let finishReason: string | undefined

      const stream = provider.stream(history, toolDefinitions, systemPrompt)

      for await (const chunk of stream as AsyncGenerator<StreamChunk>) {
        switch (chunk.type) {
          case 'text':
            assistantContent += chunk.content
            yield { type: 'text', content: chunk.content }
            break

          case 'tool_call_start':
            pendingToolCalls.set(chunk.toolCall.id, {
              id: chunk.toolCall.id,
              name: chunk.toolCall.name,
              args: '',
            })
            break

          case 'tool_call_delta': {
            const pending = pendingToolCalls.get(chunk.toolCallId)
            if (pending) pending.args += chunk.args
            break
          }

          case 'tool_call_end': {
            const completed = pendingToolCalls.get(chunk.toolCallId)
            if (completed) {
              let parsedArgs: Record<string, unknown> = {}
              try {
                parsedArgs = completed.args ? JSON.parse(completed.args) : {}
              } catch {
                // Invalid JSON args — proceed with empty
              }
              toolCalls.push({
                id: completed.id,
                name: completed.name,
                arguments: parsedArgs,
              })
              pendingToolCalls.delete(chunk.toolCallId)
            }
            break
          }

          case 'done':
            finishReason = chunk.finishReason
            if (chunk.usage) {
              totalPromptTokens += chunk.usage.promptTokens
              totalCompletionTokens += chunk.usage.completionTokens
              yield { type: 'usage', usage: { promptTokens: totalPromptTokens, completionTokens: totalCompletionTokens } }
            }
            break
        }
      }

      // Save assistant message to history
      history.push({
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        timestamp: Date.now(),
      })

      // No tool calls — agent is done
      if (toolCalls.length === 0) {
        if (finishReason === 'length') {
          yield { type: 'text', content: '\n\n---\n*Response was cut short due to output token limit.*' }
        } else if (round === 0 && !assistantContent.trim()) {
          yield { type: 'text', content: 'The model returned an empty response. Please try again.' }
        }
        break
      }

      // Execute tool calls
      yield { type: 'tool_calls', toolCalls }

      const toolResults: ToolResult[] = []
      for (const tc of toolCalls) {
        const tool = getTool(tc.name)
        if (!tool) {
          const errorResult: ToolResult = {
            toolCallId: tc.id,
            name: tc.name,
            content: `Unknown tool: ${tc.name}`,
            isError: true,
          }
          toolResults.push(errorResult)
          yield { type: 'tool_error', error: errorResult.content, toolCallId: tc.id }
          continue
        }

        try {
          const result = await tool.execute(tc.arguments)
          const toolResult: ToolResult = {
            toolCallId: tc.id,
            name: tc.name,
            content: result,
          }
          toolResults.push(toolResult)
          yield { type: 'tool_result', result: toolResult }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Tool execution failed'
          const errorResult: ToolResult = {
            toolCallId: tc.id,
            name: tc.name,
            content: errorMsg,
            isError: true,
          }
          toolResults.push(errorResult)
          yield { type: 'tool_error', error: errorMsg, toolCallId: tc.id }
        }
      }

      // Add tool results to history (truncated to prevent context explosion)
      const truncatedResults = toolResults.map((r) => ({
        ...r,
        content:
          r.content.length > maxToolResultChars
            ? r.content.slice(0, maxToolResultChars) + '\n\n... [truncated]'
            : r.content,
      }))

      history.push({
        id: generateId(),
        role: 'tool',
        content: truncatedResults.map((r) => `[${r.name}]: ${r.content}`).join('\n\n'),
        toolResults: truncatedResults,
        timestamp: Date.now(),
      })

      // Loop back to LLM with tool results
    }

    // If the loop exhausted all rounds, make one final call WITHOUT tools to force a summary
    const lastMsg = history[history.length - 1]
    if (lastMsg?.role === 'tool') {
      const provider = createProvider()
      const finalStream = provider.stream(history, [], agentConfig.systemPrompt)
      for await (const chunk of finalStream as AsyncGenerator<StreamChunk>) {
        if (chunk.type === 'text') {
          yield { type: 'text', content: chunk.content }
        }
        if (chunk.type === 'done' && chunk.usage) {
          totalPromptTokens += chunk.usage.promptTokens
          totalCompletionTokens += chunk.usage.completionTokens
          yield { type: 'usage', usage: { promptTokens: totalPromptTokens, completionTokens: totalCompletionTokens } }
        }
      }
    }

    yield { type: 'done', usage: { promptTokens: totalPromptTokens, completionTokens: totalCompletionTokens } }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred'
    yield { type: 'error', error: errorMsg }
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
