"use client"

import { useCallback, useMemo, useState } from "react"

import { ManagePromptConfigDialog } from "@/features/prompt-config/components/manage-prompt-config-dialog"
import {
  PromptConfigDialogContext,
  type PromptConfigDialogContextType,
  type PromptConfigDialogState,
} from "@/features/prompt-config/contexts/prompt-config-dialog-context"

type PromptConfigDialogProviderProps = {
  children: React.ReactNode
}

export function PromptConfigDialogProvider(
  props: PromptConfigDialogProviderProps
) {
  const { children } = props

  const [dialogState, setDialogState] = useState<PromptConfigDialogState>({
    isOpen: false,
  })

  const openDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: true }))
  }, [])
  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const value: PromptConfigDialogContextType = useMemo(
    () => ({
      dialogState,
      openDialog,
      closeDialog,
    }),
    [dialogState, openDialog, closeDialog]
  )

  return (
    <PromptConfigDialogContext value={value}>
      {children}
      <ManagePromptConfigDialog
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
      />
    </PromptConfigDialogContext>
  )
}
PromptConfigDialogProvider.displayName = "PromptConfigDialogProvider"
