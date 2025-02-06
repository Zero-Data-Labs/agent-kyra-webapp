"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { getAgentPageRoute } from "@/features/routes/utils"
import {
  DEFAULT_AGENT,
  DEFAULT_AGENT_ORDER,
} from "@/features/saved-agents/constants"
import { useCreateSavedAgent } from "@/features/saved-agents/hooks/use-create-saved-agent"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
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

  const { savedAgents } = useGetSavedAgents()

  const { selectedAiAssistant } = useAssistants()
  const { createSavedAgentAsync } = useCreateSavedAgent()
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
        let agentId = selectedAiAssistant
        let createdAgent = false

        if (
          !savedAgents ||
          !savedAgents.find((agent) => {
            return agent._id === agentId
          })
        ) {
          const newSavedAgentRecord = await createSavedAgentAsync({
            name: DEFAULT_AGENT.name,
            order: DEFAULT_AGENT_ORDER,
          })
          agentId = newSavedAgentRecord._id
          createdAgent = true
        }

        await createSavedPromptAsync({
          ...data,
          assistantId: agentId,
          order: savedPrompts
            ? Math.max(...savedPrompts.map((p) => p.order ?? 0), 0) +
              DEFAULT_SAVED_PROMPT_ORDER
            : DEFAULT_SAVED_PROMPT_ORDER,
        })

        if (createdAgent) {
          router.replace(
            getAgentPageRoute({
              agentId,
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
      createSavedAgentAsync,
      createSavedPromptAsync,
      updateSavedPromptAsync,
      selectedAiAssistant,
      dialogState,
      router,
      savedAgents,
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
