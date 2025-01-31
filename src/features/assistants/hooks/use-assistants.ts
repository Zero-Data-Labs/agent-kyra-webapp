import { useContext } from "react"

import { AssistantsContext } from "@/features/assistants/contexts/assistants-context"

export function useAssistants() {
  const context = useContext(AssistantsContext)
  if (!context) {
    throw new Error("useAssistants must be used within an AssistantProvider")
  }
  return context
}
