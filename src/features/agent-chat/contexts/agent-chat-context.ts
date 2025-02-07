import { type Dispatch, type SetStateAction, createContext } from "react"

import type {
  AgentOutput,
  LlmApiHotloadResult,
  PromptInput,
} from "@/features/agent-chat/types"

export type AgentChatContextType = {
  selectedAgent: string
  setSelectedAgent: (agentId: string) => void
  promptInput: PromptInput | null
  agentOutput: AgentOutput | null
  processPromptInput: () => Promise<void>
  setAndProcessPromptInput: (promptInput: PromptInput) => Promise<void>
  updatePromptInput: Dispatch<SetStateAction<PromptInput | null>>
  clearPromptInput: () => void
  clearAgentOutput: () => void
  error: string | null
  hotload: LlmApiHotloadResult
  promptSearchValue: string
  setPromptSearchValue: (value: string) => void
}

export const AgentChatContext = createContext<AgentChatContextType | null>(null)
