import { createContext } from "react"

import type {
  SavedPromptFormData,
  SavedPromptRecord,
} from "@/features/saved-prompts/types"

export type SavedPromptDialogState = {
  type: "create" | "edit"
  isOpen: boolean
  initialData?: Partial<SavedPromptFormData>
  savedPromptRecord?: SavedPromptRecord
}

export type SavedPromptDialogContextType = {
  dialogState: SavedPromptDialogState
  openSaveDialog: (initialData?: Partial<SavedPromptFormData>) => void
  openEditDialog: (savedPromptRecord: SavedPromptRecord) => void
  closeDialog: () => void
}

export const SavedPromptDialogContext =
  createContext<SavedPromptDialogContextType | null>(null)
