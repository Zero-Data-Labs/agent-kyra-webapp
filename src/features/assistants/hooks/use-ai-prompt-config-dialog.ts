import { useContext } from "react"

import { AiPromptConfigDialogContext } from "@/features/assistants/contexts/ai-prompt-config-dialog-context"

export function useAiPromptConfigDialog() {
  const context = useContext(AiPromptConfigDialogContext)

  if (!context) {
    throw new Error(
      "useAiPromptConfigDialog must be used within an AiPromptConfigDialogProvider"
    )
  }

  return context
}
