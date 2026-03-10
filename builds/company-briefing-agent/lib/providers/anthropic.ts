import type { ChatMessage, ToolDefinition, LLMResponse, StreamChunk, ToolCall } from '../types'
import { BaseProvider } from './base'

/**
 * Native Anthropic Messages API provider. Uses fetch directly — no SDK.
 */
export class AnthropicProvider extends BaseProvider {
  constructor(apiKey: string, model: string, maxTokens?: number) {
    super(apiKey, model, 'https://api.anthropic.com', maxTokens || 16384)
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    }
  }

  protected formatTools(tools: ToolDefinition[]) {
    return tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    }))
  }

  protected formatMessages(messages: ChatMessage[]) {
    const out: Record<string, unknown>[] = []

    for (const msg of messages) {
      if (msg.role === 'tool' && msg.toolResults) {
        out.push({
          role: 'user',
          content: msg.toolResults.map((r) => ({
            type: 'tool_result',
            tool_use_id: r.toolCallId,
            content: r.content,
          })),
        })
        continue
      }

      if (msg.role === 'assistant') {
        const content: unknown[] = []
        if (msg.content) {
          content.push({ type: 'text', text: msg.content })
        }
        if (msg.toolCalls?.length) {
          for (const tc of msg.toolCalls) {
            content.push({
              type: 'tool_use',
              id: tc.id,
              name: tc.name,
              input: tc.arguments,
            })
          }
        }
        out.push({ role: 'assistant', content })
        continue
      }

      out.push({ role: 'user', content: msg.content })
    }

    return out
  }

  async chat(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    systemPrompt?: string,
  ): Promise<LLMResponse> {
    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: this.maxTokens,
      messages: this.formatMessages(messages),
    }

    if (systemPrompt) body.system = systemPrompt
    if (tools?.length) body.tools = this.formatTools(tools)

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Anthropic API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    let content = ''
    const toolCalls: ToolCall[] = []

    for (const block of data.content) {
      if (block.type === 'text') content += block.text
      else if (block.type === 'tool_use') {
        toolCalls.push({ id: block.id, name: block.name, arguments: block.input })
      }
    }

    return {
      content,
      toolCalls: toolCalls.length ? toolCalls : undefined,
      usage: data.usage
        ? { promptTokens: data.usage.input_tokens, completionTokens: data.usage.output_tokens }
        : undefined,
    }
  }

  async *stream(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    systemPrompt?: string,
  ): AsyncGenerator<StreamChunk> {
    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: this.maxTokens,
      messages: this.formatMessages(messages),
      stream: true,
    }

    if (systemPrompt) body.system = systemPrompt
    if (tools?.length) body.tools = this.formatTools(tools)

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Anthropic API error ${res.status}: ${text}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentToolId = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()!

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue

        let event: Record<string, unknown>
        try {
          event = JSON.parse(trimmed.slice(6))
        } catch {
          continue
        }

        const type = event.type as string

        if (type === 'content_block_start') {
          const block = event.content_block as Record<string, unknown>
          if (block?.type === 'tool_use') {
            currentToolId = block.id as string
            yield { type: 'tool_call_start', toolCall: { id: currentToolId, name: block.name as string } }
          }
        }

        if (type === 'content_block_delta') {
          const delta = event.delta as Record<string, unknown>
          if (delta?.type === 'text_delta') {
            yield { type: 'text', content: delta.text as string }
          }
          if (delta?.type === 'input_json_delta') {
            yield { type: 'tool_call_delta', toolCallId: currentToolId, args: delta.partial_json as string }
          }
        }

        if (type === 'content_block_stop' && currentToolId) {
          yield { type: 'tool_call_end', toolCallId: currentToolId }
          currentToolId = ''
        }

        if (type === 'message_delta') {
          const delta = event.delta as Record<string, string> | undefined
          const usage = event.usage as { input_tokens?: number; output_tokens: number } | undefined
          yield {
            type: 'done',
            finishReason: delta?.stop_reason === 'tool_use' ? 'tool_calls' : delta?.stop_reason,
            usage: usage
              ? { promptTokens: usage.input_tokens ?? 0, completionTokens: usage.output_tokens }
              : undefined,
          }
          return
        }
      }
    }

    yield { type: 'done', finishReason: 'stop' }
  }
}
