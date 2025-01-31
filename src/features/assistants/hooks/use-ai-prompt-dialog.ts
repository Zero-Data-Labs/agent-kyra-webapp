import { useContext } from "react"

import { AiPromptDialogContext } from "@/features/assistants/contexts/ai-prompt-dialog-context"

export function useAiPromptDialog() {
  const context = useContext(AiPromptDialogContext)

  if (!context) {
    throw new Error(
      "useAiPromptDialog must be used within an AiPromptDialogProvider"
    )
  }

  return context
}
