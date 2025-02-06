"use client"

import { redirect } from "next/navigation"

import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { getAgentPageRoute } from "@/features/routes/utils"

export default function AgentsPage() {
  const { selectedAgent } = useAgentChat()

  redirect(
    getAgentPageRoute({
      agentId: selectedAgent,
    })
  )
}
AgentsPage.displayName = "AgentsPage"
