'use client'

import { useState, useRef, useEffect, useCallback, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { ChatMessage, AgentStreamEvent, ToolCall, ToolResult } from '@/lib/types'

// ── Markdown components ──

function CodeBlock({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) {
  const [copied, setCopied] = useState(false)
  const isInline = !className && typeof children === 'string' && !children.includes('\n')
  if (isInline) return <code className={className} {...props}>{children}</code>

  const lang = className?.replace('hljs language-', '')?.replace('language-', '') || ''
  function handleCopy() {
    navigator.clipboard.writeText(typeof children === 'string' ? children : '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <div className="flex items-center justify-between px-4 py-1.5 text-[11px] border-b border-black/5" style={{ background: 'oklch(0.95 0.003 80)' }}>
        <span className="uppercase tracking-wider text-foreground/30 font-medium">{lang || 'code'}</span>
        <button onClick={handleCopy} className="text-foreground/30 hover:text-foreground/60 transition-colors">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <code className={className} {...props}>{children}</code>
    </div>
  )
}

const mdComponents = {
  code: CodeBlock,
  table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto custom-scrollbar rounded-lg"><table {...props}>{children}</table></div>
  ),
}

// ── Token formatting ──
function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

// ── Tool result card ──
function ToolResultCard({ name, content, isError }: { name: string; content: string; isError?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-lg border overflow-hidden ${isError ? 'border-destructive/30 bg-red-50' : 'border-border bg-card/50'}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-muted/30 transition-colors">
        <span className={`flex h-5 w-5 items-center justify-center rounded ${isError ? 'bg-red-100 text-destructive' : 'bg-primary/10 text-primary'}`}>
          {isError ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          )}
        </span>
        <span className="font-medium text-foreground/80">{name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`ml-auto text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-border/50 bg-muted/10 p-3 max-h-80 overflow-auto custom-scrollbar">
          <div className="prose-chat">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={mdComponents}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ──

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [streamToolCalls, setStreamToolCalls] = useState<ToolCall[]>([])
  const [streamToolResults, setStreamToolResults] = useState<ToolResult[]>([])
  const [tokenUsage, setTokenUsage] = useState<{ promptTokens: number; completionTokens: number } | null>(null)
  const [currentRound, setCurrentRound] = useState<{ round: number; maxRounds: number } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, streamContent, streamToolCalls, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const handleStop = useCallback(() => { abortRef.current?.abort() }, [])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)
    setStreamContent('')
    setStreamToolCalls([])
    setStreamToolResults([])
    setTokenUsage(null)
    setCurrentRound(null)

    const controller = new AbortController()
    abortRef.current = controller

    let accContent = ''
    let accToolCalls: ToolCall[] = []
    let accToolResults: ToolResult[] = []

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) throw new Error('Failed to send message')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n')
        buffer = parts.pop() || ''

        for (const part of parts) {
          const trimmed = part.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (!data || data === '[DONE]') continue

          try {
            const event: AgentStreamEvent = JSON.parse(data)

            switch (event.type) {
              case 'text':
                accContent += event.content
                setStreamContent(accContent)
                break
              case 'tool_calls':
                accToolCalls = [...accToolCalls, ...event.toolCalls]
                setStreamToolCalls(accToolCalls)
                break
              case 'tool_result':
                accToolResults = [...accToolResults, event.result]
                setStreamToolResults(accToolResults)
                break
              case 'round':
                setCurrentRound({ round: event.round, maxRounds: event.maxRounds })
                break
              case 'usage':
                setTokenUsage(event.usage)
                break
              case 'error':
                accContent += `\n\n**Error:** ${event.error}`
                setStreamContent(accContent)
                break
              case 'done':
                if (event.usage) setTokenUsage(event.usage)
                break
            }
          } catch {
            // skip malformed events
          }
        }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: accContent.trim(),
        toolCalls: accToolCalls.length > 0 ? accToolCalls : undefined,
        toolResults: accToolResults.length > 0 ? accToolResults : undefined,
        timestamp: Date.now(),
      }

      setMessages([...newMessages, assistantMessage])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        if (accContent) {
          setMessages([
            ...newMessages,
            { id: crypto.randomUUID(), role: 'assistant', content: accContent, toolCalls: accToolCalls.length > 0 ? accToolCalls : undefined, timestamp: Date.now() },
          ])
        }
      } else {
        setMessages([
          ...newMessages,
          { id: crypto.randomUUID(), role: 'assistant', content: `Something went wrong. ${err instanceof Error ? err.message : 'Please try again.'}`, timestamp: Date.now() },
        ])
      }
    } finally {
      abortRef.current = null
      setIsStreaming(false)
      setStreamContent('')
      setStreamToolCalls([])
      setStreamToolResults([])
      setCurrentRound(null)
    }
  }, [isStreaming, messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          </div>
          <h1 className="text-sm font-semibold">Agentic Harness</h1>
        </div>
        {currentRound && isStreaming && (
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            Round {currentRound.round}/{currentRound.maxRounds}
          </span>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
              </div>
              <h2 className="text-lg font-semibold mb-1">Agentic Harness</h2>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                Ask me anything. I can search the web, read pages, and write files.
              </p>
            </div>
          )}

          <div className="space-y-1">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-fade-in-up">
                {msg.role === 'user' ? (
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Agent</span>
                    </div>
                    <div className="pl-8">
                      {msg.content && (
                        <div className="prose-chat">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={mdComponents}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.toolResults && msg.toolResults.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.toolResults.map((r) => <ToolResultCard key={r.toolCallId} name={r.name} content={r.content} isError={r.isError} />)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Streaming message */}
            {isStreaming && (
              <div className="mb-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Agent</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-primary/70">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/70" />
                    </span>
                    {!streamContent && streamToolCalls.length === 0 ? 'Thinking...' : 'Working...'}
                  </span>
                </div>
                <div className="pl-8">
                  {/* Active tool indicator */}
                  {streamToolCalls.length > 0 && (() => {
                    const activeTool = streamToolCalls.find(tc => !streamToolResults.some(r => r.toolCallId === tc.id))
                    const displayTool = activeTool || streamToolCalls[streamToolCalls.length - 1]
                    const isActive = !!activeTool
                    return (
                      <div className="mb-3">
                        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${isActive ? 'border-primary/20 bg-primary/5 tool-pulse' : 'border-border bg-card/30'}`}>
                          {isActive ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M20 6L9 17l-5-5" /></svg>
                          )}
                          <span className={isActive ? 'text-foreground/80' : 'text-muted-foreground'}>{displayTool.name}</span>
                          {streamToolCalls.length > 1 && (
                            <span className="text-muted-foreground/50 ml-auto">{streamToolResults.length}/{streamToolCalls.length}</span>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Thinking skeleton */}
                  {!streamContent && streamToolCalls.length === 0 && (
                    <div className="space-y-2.5 py-1">
                      <div className="h-3 w-3/4 rounded-md bg-muted/60 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-md bg-muted/40 animate-pulse" />
                      <div className="h-3 w-2/3 rounded-md bg-muted/50 animate-pulse" />
                    </div>
                  )}

                  {/* Streaming text */}
                  {streamContent && (
                    <div className="prose-chat">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={mdComponents}>{streamContent}</ReactMarkdown>
                      <span className="typing-cursor inline-block h-4 w-0.5 bg-primary ml-0.5 align-middle rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isStreaming ? 'Waiting for response...' : 'Ask anything...'}
                disabled={isStreaming}
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50"
                rows={1}
                style={{ maxHeight: '160px' }}
              />
              {isStreaming ? (
                <button type="button" onClick={handleStop}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-destructive text-white transition-all hover:bg-destructive/90"
                  title="Stop generating">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
          </form>
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/40">
            <span>Enter to send, Shift+Enter for new line</span>
            {tokenUsage && (tokenUsage.promptTokens > 0 || tokenUsage.completionTokens > 0) && (
              <span className="text-muted-foreground/60">
                {formatTokens(tokenUsage.promptTokens + tokenUsage.completionTokens)} tokens
                ({formatTokens(tokenUsage.promptTokens)} in + {formatTokens(tokenUsage.completionTokens)} out)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
