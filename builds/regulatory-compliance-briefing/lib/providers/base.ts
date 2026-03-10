import type { ChatMessage, ToolDefinition, LLMResponse, StreamChunk } from '../types'

export abstract class BaseProvider {
  protected apiKey: string
  protected model: string
  protected baseUrl: string
  protected maxTokens: number

  constructor(apiKey: string, model: string, baseUrl?: string, maxTokens?: number) {
    this.apiKey = apiKey
    this.model = model
    this.baseUrl = baseUrl ?? ''
    this.maxTokens = maxTokens ?? 16384
  }

  abstract chat(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    systemPrompt?: string,
  ): Promise<LLMResponse>

  abstract stream(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    systemPrompt?: string,
  ): AsyncGenerator<StreamChunk>

  protected abstract formatTools(tools: ToolDefinition[]): unknown[]

  protected abstract formatMessages(messages: ChatMessage[]): unknown[]
}
