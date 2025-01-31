import { createContext } from "react"

export type AiPromptConfigDialogState = {
  isOpen: boolean
}

export type AiPromptConfigDialogContextType = {
  dialogState: AiPromptConfigDialogState
  openDialog: () => void
  closeDialog: () => void
}

export const AiPromptConfigDialogContext =
  createContext<AiPromptConfigDialogContextType | null>(null)
