import React from "react"

import { AiAssistantDialogProvider } from "@/features/assistants/components/ai-assistant-dialog-provider"
import { SavedPromptDialogProvider } from "@/features/saved-prompts/components/saved-prompt-dialog-provider"

export interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout(props: AgentsLayoutProps) {
  const { children } = props

  return (
    <AiAssistantDialogProvider>
      <SavedPromptDialogProvider>{children}</SavedPromptDialogProvider>
    </AiAssistantDialogProvider>
  )
}
AgentsLayout.displayName = "AgentsLayout"
