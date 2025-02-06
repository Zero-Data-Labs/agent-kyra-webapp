import React from "react"

import { SavedAgentDialogProvider } from "@/features/saved-agents/components/saved-agent-dialog-provider"
import { SavedPromptDialogProvider } from "@/features/saved-prompts/components/saved-prompt-dialog-provider"

export interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout(props: AgentsLayoutProps) {
  const { children } = props

  return (
    <SavedAgentDialogProvider>
      <SavedPromptDialogProvider>{children}</SavedPromptDialogProvider>
    </SavedAgentDialogProvider>
  )
}
AgentsLayout.displayName = "AgentsLayout"
