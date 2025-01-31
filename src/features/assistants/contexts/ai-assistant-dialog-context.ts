import { createContext } from "react"

import type {
  AiAssistantFormData,
  AiAssistantRecord,
} from "@/features/assistants/types"

export type AiAssistantDialogState = {
  type: "create" | "edit"
  isOpen: boolean
  initialData?: Partial<AiAssistantFormData>
  aiAssistantRecord?: AiAssistantRecord
}

export type AiAssistantDialogContextType = {
  dialogState: AiAssistantDialogState
  openCreateDialog: (initialData?: Partial<AiAssistantFormData>) => void
  openEditDialog: (aiAssistantRecord: AiAssistantRecord) => void
  closeDialog: () => void
}

export const AiAssistantDialogContext =
  createContext<AiAssistantDialogContextType | null>(null)
