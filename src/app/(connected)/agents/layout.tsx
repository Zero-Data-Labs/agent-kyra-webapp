import React from "react"

import { AiAssistantDialogProvider } from "@/features/assistants/components/ai-assistant-dialog-provider"
import { AiPromptDialogProvider } from "@/features/assistants/components/ai-prompt-dialog-provider"

export interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout(props: AgentsLayoutProps) {
  const { children } = props

  return (
    <AiAssistantDialogProvider>
      <AiPromptDialogProvider>{children}</AiPromptDialogProvider>
    </AiAssistantDialogProvider>
  )
}
AgentsLayout.displayName = "AgentsLayout"
