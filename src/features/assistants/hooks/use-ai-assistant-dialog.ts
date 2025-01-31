import { useContext } from "react"

import { AiAssistantDialogContext } from "@/features/assistants/contexts/ai-assistant-dialog-context"

export function useAiAssistantDialog() {
  const context = useContext(AiAssistantDialogContext)

  if (!context) {
    throw new Error(
      "useAiAssistantDialog must be used within an AiAssistantDialogProvider"
    )
  }

  return context
}
