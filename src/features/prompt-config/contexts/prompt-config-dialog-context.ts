import { createContext } from "react"

export type PromptConfigDialogState = {
  isOpen: boolean
}

export type PromptConfigDialogContextType = {
  dialogState: PromptConfigDialogState
  openDialog: () => void
  closeDialog: () => void
}

export const PromptConfigDialogContext =
  createContext<PromptConfigDialogContextType | null>(null)
