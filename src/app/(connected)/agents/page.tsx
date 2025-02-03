"use client"

import { redirect } from "next/navigation"

import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { getAgentPageRoute } from "@/features/routes/utils"

export default function AgentsPage() {
  const { selectedAiAssistant } = useAssistants()

  redirect(
    getAgentPageRoute({
      agentId: selectedAiAssistant,
    })
  )
}
AgentsPage.displayName = "AgentsPage"
