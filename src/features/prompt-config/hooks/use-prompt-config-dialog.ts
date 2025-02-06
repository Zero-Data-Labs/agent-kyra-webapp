import { useContext } from "react"

import { PromptConfigDialogContext } from "@/features/prompt-config/contexts/prompt-config-dialog-context"

export function usePromptConfigDialog() {
  const context = useContext(PromptConfigDialogContext)

  if (!context) {
    throw new Error(
      "usePromptConfigDialog must be used within an PromptConfigDialogProvider"
    )
  }

  return context
}
