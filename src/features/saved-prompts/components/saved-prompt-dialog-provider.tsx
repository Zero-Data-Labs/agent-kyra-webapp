"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import {
  DEFAULT_ASSISTANT,
  DEFAULT_ASSISTANT_ORDER,
} from "@/features/assistants/constants"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { useCreateAiAssistant } from "@/features/assistants/hooks/use-create-ai-assistant"
import { useGetAiAssistants } from "@/features/assistants/hooks/use-get-ai-assistants"
import { getAgentPageRoute } from "@/features/routes/utils"
import { ManageSavedPromptDialog } from "@/features/saved-prompts/components/manage-saved-prompt-dialog"
import { DEFAULT_SAVED_PROMPT_ORDER } from "@/features/saved-prompts/constants"
import {
  SavedPromptDialogContext,
  type SavedPromptDialogContextType,
  type SavedPromptDialogState,
} from "@/features/saved-prompts/contexts/saved-prompt-dialog-context"
import { useCreateSavedPrompt } from "@/features/saved-prompts/hooks/use-create-saved-prompt"
import { useDeleteSavedPrompt } from "@/features/saved-prompts/hooks/use-delete-saved-prompt"
import { useGetSavedPrompts } from "@/features/saved-prompts/hooks/use-get-saved-prompts"
import { useUpdateSavedPrompt } from "@/features/saved-prompts/hooks/use-update-saved-prompt"
import type {
  SavedPromptFormData,
  SavedPromptRecord,
} from "@/features/saved-prompts/types"

export type SavedPromptDialogProviderProps = {
  children: React.ReactNode
}

export function SavedPromptDialogProvider(
  props: SavedPromptDialogProviderProps
) {
  const { children } = props

  const router = useRouter()

  const [dialogState, setDialogState] = useState<SavedPromptDialogState>({
    type: "create",
    isOpen: false,
  })

  const { aiAssistants } = useGetAiAssistants()

  const { selectedAiAssistant } = useAssistants()
  const { createAiAssistantAsync } = useCreateAiAssistant()
  const { savedPrompts } = useGetSavedPrompts({
    filter: {
      assistantId: selectedAiAssistant,
    },
  })
  const { createSavedPromptAsync } = useCreateSavedPrompt()
  const { updateSavedPromptAsync } = useUpdateSavedPrompt()
  const { deleteSavedPromptAsync } = useDeleteSavedPrompt()

  const openSaveDialog = useCallback(
    (initialData?: Partial<SavedPromptFormData>) => {
      setDialogState({
        type: "create",
        isOpen: true,
        initialData,
      })
    },
    []
  )

  const openEditDialog = useCallback((savedPromptRecord: SavedPromptRecord) => {
    setDialogState({
      type: "edit",
      isOpen: true,
      initialData: {
        ...savedPromptRecord,
      },
      savedPromptRecord,
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleSubmit = useCallback(
    async (data: SavedPromptFormData) => {
      if (dialogState.type === "create") {
        let assistantId = selectedAiAssistant
        let createdAssistant = false

        if (
          !aiAssistants ||
          !aiAssistants.find((assistant) => {
            return assistant._id === assistantId
          })
        ) {
          const newAssistantRecord = await createAiAssistantAsync({
            name: DEFAULT_ASSISTANT.name,
            order: DEFAULT_ASSISTANT_ORDER,
          })
          assistantId = newAssistantRecord._id
          createdAssistant = true
        }

        await createSavedPromptAsync({
          ...data,
          assistantId,
          order: savedPrompts
            ? Math.max(...savedPrompts.map((p) => p.order ?? 0), 0) +
              DEFAULT_SAVED_PROMPT_ORDER
            : DEFAULT_SAVED_PROMPT_ORDER,
        })

        if (createdAssistant) {
          router.replace(
            getAgentPageRoute({
              agentId: assistantId,
            })
          )
        }
      } else if (dialogState.savedPromptRecord) {
        await updateSavedPromptAsync({
          ...dialogState.savedPromptRecord,
          ...data,
        })
      }
    },
    [
      createAiAssistantAsync,
      createSavedPromptAsync,
      updateSavedPromptAsync,
      selectedAiAssistant,
      dialogState,
      router,
      aiAssistants,
      savedPrompts,
    ]
  )

  const handleDelete = useCallback(async () => {
    if (dialogState.savedPromptRecord) {
      await deleteSavedPromptAsync(dialogState.savedPromptRecord._id)
    }
  }, [deleteSavedPromptAsync, dialogState])

  const value: SavedPromptDialogContextType = useMemo(
    () => ({
      dialogState,
      openSaveDialog,
      openEditDialog,
      closeDialog,
    }),
    [dialogState, openSaveDialog, openEditDialog, closeDialog]
  )

  return (
    <SavedPromptDialogContext.Provider value={value}>
      {children}
      <ManageSavedPromptDialog
        type={dialogState.type}
        initialData={dialogState.initialData ?? {}}
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={handleSubmit}
        onDelete={dialogState.type === "edit" ? handleDelete : undefined}
      />
    </SavedPromptDialogContext.Provider>
  )
}
SavedPromptDialogProvider.displayName = "SavedPromptDialogProvider"
