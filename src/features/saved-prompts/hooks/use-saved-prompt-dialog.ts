import { useContext } from "react"

import { SavedPromptDialogContext } from "@/features/saved-prompts/contexts/saved-prompt-dialog-context"

export function useSavedPromptDialog() {
  const context = useContext(SavedPromptDialogContext)

  if (!context) {
    throw new Error(
      "useSavedPromptDialog must be used within an SavedPromptDialogProvider"
    )
  }

  return context
}
