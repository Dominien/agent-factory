// ── Chat Types ──

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  toolResults?: ToolResult[]
  timestamp: number
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export interface ToolResult {
  toolCallId: string
  name: string
  content: string
  isError?: boolean
}

export interface LLMResponse {
  content: string
  toolCalls?: ToolCall[]
  usage?: TokenUsage
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
}

// ── Tool Definitions ──

export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, ToolParameterProperty>
    required?: string[]
  }
}

export interface ToolParameterProperty {
  type: string
  description: string
  enum?: string[]
  items?: { type: string }
  default?: unknown
}

// ── Streaming Types ──

export type StreamChunk =
  | { type: 'text'; content: string }
  | { type: 'tool_call_start'; toolCall: { id: string; name: string } }
  | { type: 'tool_call_delta'; toolCallId: string; args: string }
  | { type: 'tool_call_end'; toolCallId: string }
  | { type: 'done'; usage?: TokenUsage; finishReason?: string }

export type AgentStreamEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_calls'; toolCalls: ToolCall[] }
  | { type: 'tool_result'; result: ToolResult }
  | { type: 'tool_error'; error: string; toolCallId: string }
  | { type: 'round'; round: number; maxRounds: number }
  | { type: 'error'; error: string }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'done'; usage?: TokenUsage }
