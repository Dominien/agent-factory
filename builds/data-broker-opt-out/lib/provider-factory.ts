import { BaseProvider } from './providers/base'
import { AnthropicProvider } from './providers/anthropic'
import { OpenAIProvider } from './providers/openai'

/**
 * Reads PROVIDER, MODEL, and API key from environment variables.
 * Returns the correct provider instance.
 *
 * Supported providers:
 *   - anthropic  → Anthropic Messages API (native)
 *   - openai     → OpenAI Chat Completions API
 *   - openrouter → OpenRouter (OpenAI-compatible)
 *   - ollama     → Ollama (OpenAI-compatible, local)
 */
export function createProvider(): BaseProvider {
  const provider = process.env.PROVIDER || 'anthropic'
  const model = process.env.MODEL || 'claude-sonnet-4-6'
  const maxTokens = process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS, 10) : undefined

  switch (provider) {
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY
      if (!key) throw new Error('ANTHROPIC_API_KEY is required when PROVIDER=anthropic')
      return new AnthropicProvider(key, model, maxTokens)
    }

    case 'openai': {
      const key = process.env.OPENAI_API_KEY
      if (!key) throw new Error('OPENAI_API_KEY is required when PROVIDER=openai')
      return new OpenAIProvider(key, model, undefined, maxTokens)
    }

    case 'openrouter': {
      const key = process.env.OPENROUTER_API_KEY
      if (!key) throw new Error('OPENROUTER_API_KEY is required when PROVIDER=openrouter')
      return new OpenAIProvider(key, model, 'https://openrouter.ai/api/v1', maxTokens)
    }

    case 'ollama': {
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1'
      return new OpenAIProvider('ollama', model, baseUrl, maxTokens)
    }

    default:
      throw new Error(`Unknown PROVIDER: ${provider}. Use anthropic, openai, openrouter, or ollama.`)
  }
}
