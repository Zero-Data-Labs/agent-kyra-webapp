import { useContext } from "react"

import { SavedAgentDialogContext } from "@/features/saved-agents/contexts/saved-agent-dialog-context"

export function useSavedAgentDialog() {
  const context = useContext(SavedAgentDialogContext)

  if (!context) {
    throw new Error(
      "useSavedAgentDialog must be used within an SavedAgentDialogProvider"
    )
  }

  return context
}
