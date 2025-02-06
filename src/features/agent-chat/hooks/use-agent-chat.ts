import { useContext } from "react"

import { AgentChatContext } from "@/features/agent-chat/contexts/agent-chat-context"

export function useAgentChat() {
  const context = useContext(AgentChatContext)
  if (!context) {
    throw new Error("useAgentChat must be used within an AgentChatProvider")
  }
  return context
}
