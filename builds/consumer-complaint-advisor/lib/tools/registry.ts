import type { ToolDefinition } from '../types'

export interface RegisteredTool {
  definition: ToolDefinition
  execute: (args: Record<string, unknown>) => Promise<string>
}

const toolRegistry = new Map<string, RegisteredTool>()

/** Register a tool so the orchestrator can use it */
export function registerTool(tool: RegisteredTool) {
  toolRegistry.set(tool.definition.name, tool)
}

/** Get a tool by name */
export function getTool(name: string): RegisteredTool | undefined {
  return toolRegistry.get(name)
}

/** Get all tool definitions for the LLM */
export function getToolDefinitions(): ToolDefinition[] {
  return Array.from(toolRegistry.values()).map((t) => t.definition)
}

/** Get the full registry map */
export function getRegistry(): Map<string, RegisteredTool> {
  return toolRegistry
}
