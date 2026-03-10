import type { ChatMessage, ToolDefinition, LLMResponse, StreamChunk, ToolCall } from '../types'
import { BaseProvider } from './base'

/**
 * OpenAI-compatible provider. Works with OpenAI, OpenRouter, Ollama, vLLM,
 * and any API that implements the OpenAI chat completions format.
 */
export class OpenAIProvider extends BaseProvider {
  constructor(apiKey: string, model: string, baseUrl?: string, maxTokens?: number) {
    super(apiKey, model, baseUrl ?? 'https://api.openai.com/v1', maxTokens)
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }
  }

  protected formatTools(tools: ToolDefinition[]) {
    return tools.map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }))
  }

  protected formatMessages(messages: ChatMessage[]) {
    const out: Record<string, unknown>[] = []

    for (const msg of messages) {
      if (msg.role === 'tool' && msg.toolResults) {
        for (const r of msg.toolResults) {
          out.push({
            role: 'tool',
            tool_call_id: r.toolCallId,
            content: r.content,
          })
        }
        continue
      }

      const formatted: Record<string, unknown> = {
        role: msg.role === 'tool' ? 'user' : msg.role,
        content: msg.content,
      }

      if (msg.role === 'assistant' && msg.toolCalls?.length) {
        formatted.tool_calls = msg.toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments),
          },
        }))
      }

      out.push(formatted)
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
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...this.formatMessages(messages),
      ],
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
    }

    if (tools?.length) {
      body.tools = this.formatTools(tools)
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`OpenAI API error ${res.status}: ${text}`)
    }

    const data = await res.json()
    const choice = data.choices?.[0]
    const message = choice?.message

    const toolCalls: ToolCall[] | undefined = message?.tool_calls?.map(
      (tc: { id: string; function: { name: string; arguments: string } }) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      }),
    )

    return {
      content: message?.content ?? '',
      toolCalls: toolCalls?.length ? toolCalls : undefined,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
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
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...this.formatMessages(messages),
      ],
      ...(this.maxTokens ? { max_tokens: this.maxTokens } : {}),
      stream: true,
      stream_options: { include_usage: true },
    }

    if (tools?.length) {
      body.tools = this.formatTools(tools)
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`OpenAI API error ${res.status}: ${text}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    const pendingToolCalls = new Map<number, { id: string; name: string; args: string }>()
    let lastFinishReason: string | undefined

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()!

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const payload = trimmed.slice(6)
        if (payload === '[DONE]') {
          for (const tc of Array.from(pendingToolCalls.values())) {
            yield { type: 'tool_call_end', toolCallId: tc.id }
          }
          yield { type: 'done', finishReason: lastFinishReason }
          return
        }

        let event: Record<string, unknown>
        try {
          event = JSON.parse(payload)
        } catch {
          continue
        }

        // Usage chunk (OpenRouter sends this in a final chunk with empty choices)
        const usage = event.usage as { prompt_tokens: number; completion_tokens: number } | undefined
        if (usage) {
          for (const tc of Array.from(pendingToolCalls.values())) {
            yield { type: 'tool_call_end', toolCallId: tc.id }
          }
          pendingToolCalls.clear()
          yield {
            type: 'done',
            finishReason: lastFinishReason,
            usage: { promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens },
          }
          return
        }

        const choice = (event.choices as Array<{ delta: Record<string, unknown>; finish_reason?: string }>)?.[0]
        const delta = choice?.delta
        if (!delta) continue

        if (choice?.finish_reason) {
          lastFinishReason = choice.finish_reason
        }

        if (typeof delta.content === 'string' && delta.content) {
          yield { type: 'text', content: delta.content }
        }

        const toolCallDeltas = delta.tool_calls as
          | Array<{ index: number; id?: string; function?: { name?: string; arguments?: string } }>
          | undefined

        if (toolCallDeltas) {
          for (const tcd of toolCallDeltas) {
            const idx = tcd.index
            let pending = pendingToolCalls.get(idx)

            if (tcd.id && !pending) {
              pending = { id: tcd.id, name: tcd.function?.name ?? '', args: '' }
              pendingToolCalls.set(idx, pending)
              yield { type: 'tool_call_start', toolCall: { id: pending.id, name: pending.name } }
            }

            if (pending && tcd.function?.arguments) {
              pending.args += tcd.function.arguments
              yield { type: 'tool_call_delta', toolCallId: pending.id, args: tcd.function.arguments }
            }
          }
        }
      }
    }

    // Stream ended without [DONE]
    for (const tc of Array.from(pendingToolCalls.values())) {
      yield { type: 'tool_call_end', toolCallId: tc.id }
    }
    yield { type: 'done', finishReason: lastFinishReason }
  }
}
