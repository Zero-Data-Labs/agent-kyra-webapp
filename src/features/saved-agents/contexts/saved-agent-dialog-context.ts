import { createContext } from "react"

import type {
  SavedAgentFormData,
  SavedAgentRecord,
} from "@/features/saved-agents/types"

export type SavedAgentDialogState = {
  type: "create" | "edit"
  isOpen: boolean
  initialData?: Partial<SavedAgentFormData>
  savedAgentRecord?: SavedAgentRecord
}

export type SavedAgentDialogContextType = {
  dialogState: SavedAgentDialogState
  openCreateDialog: (initialData?: Partial<SavedAgentFormData>) => void
  openEditDialog: (savedAgentRecord: SavedAgentRecord) => void
  closeDialog: () => void
}

export const SavedAgentDialogContext =
  createContext<SavedAgentDialogContextType | null>(null)
