import { createContext } from "react"

import type {
  AiPromptFormData,
  AiPromptRecord,
} from "@/features/assistants/types"

export type AiPromptDialogState = {
  type: "create" | "edit"
  isOpen: boolean
  initialData?: Partial<AiPromptFormData>
  aiPromptRecord?: AiPromptRecord
}

export type AiPromptDialogContextType = {
  dialogState: AiPromptDialogState
  openSaveDialog: (initialData?: Partial<AiPromptFormData>) => void
  openEditDialog: (aiPromptRecord: AiPromptRecord) => void
  closeDialog: () => void
}

export const AiPromptDialogContext =
  createContext<AiPromptDialogContextType | null>(null)
