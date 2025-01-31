"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import { ManageAiPromptDialog } from "@/features/assistants/components/manage-ai-prompt-dialog"
import {
  DEFAULT_ASSISTANT,
  DEFAULT_ASSISTANT_ORDER,
  DEFAULT_PROMPT_ORDER,
} from "@/features/assistants/constants"
import {
  AiPromptDialogContext,
  type AiPromptDialogContextType,
  type AiPromptDialogState,
} from "@/features/assistants/contexts/ai-prompt-dialog-context"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { useCreateAiAssistant } from "@/features/assistants/hooks/use-create-ai-assistant"
import { useCreateAiPrompt } from "@/features/assistants/hooks/use-create-ai-prompt"
import { useDeleteAiPrompt } from "@/features/assistants/hooks/use-delete-ai-prompt"
import { useGetAiAssistants } from "@/features/assistants/hooks/use-get-ai-assistants"
import { useGetAiPrompts } from "@/features/assistants/hooks/use-get-ai-prompts"
import { useUpdateAiPrompt } from "@/features/assistants/hooks/use-update-ai-prompt"
import type {
  AiPromptFormData,
  AiPromptRecord,
} from "@/features/assistants/types"
import { getAgentPageRoute } from "@/features/routes/utils"

type AiPromptDialogProviderProps = {
  children: React.ReactNode
}

export function AiPromptDialogProvider(props: AiPromptDialogProviderProps) {
  const { children } = props

  const router = useRouter()

  const [dialogState, setDialogState] = useState<AiPromptDialogState>({
    type: "create",
    isOpen: false,
  })

  const { aiAssistants } = useGetAiAssistants()

  const { selectedAiAssistant } = useAssistants()
  const { createAiAssistantAsync } = useCreateAiAssistant()
  const { aiPrompts } = useGetAiPrompts({
    filter: {
      assistantId: selectedAiAssistant,
    },
  })
  const { createAiPromptAsync } = useCreateAiPrompt()
  const { updateAiPromptAsync } = useUpdateAiPrompt()
  const { deleteAiPromptAsync } = useDeleteAiPrompt()

  const openSaveDialog = useCallback(
    (initialData?: Partial<AiPromptFormData>) => {
      setDialogState({
        type: "create",
        isOpen: true,
        initialData,
      })
    },
    []
  )

  const openEditDialog = useCallback((aiPromptRecord: AiPromptRecord) => {
    setDialogState({
      type: "edit",
      isOpen: true,
      initialData: {
        ...aiPromptRecord,
      },
      aiPromptRecord,
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleSubmit = useCallback(
    async (data: AiPromptFormData) => {
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

        await createAiPromptAsync({
          ...data,
          assistantId,
          order: aiPrompts
            ? Math.max(...aiPrompts.map((p) => p.order ?? 0), 0) +
              DEFAULT_PROMPT_ORDER
            : DEFAULT_PROMPT_ORDER,
        })

        if (createdAssistant) {
          router.replace(
            getAgentPageRoute({
              agentId: assistantId,
            })
          )
        }
      } else if (dialogState.aiPromptRecord) {
        await updateAiPromptAsync({
          ...dialogState.aiPromptRecord,
          ...data,
        })
      }
    },
    [
      createAiAssistantAsync,
      createAiPromptAsync,
      updateAiPromptAsync,
      selectedAiAssistant,
      dialogState,
      router,
      aiAssistants,
      aiPrompts,
    ]
  )

  const handleDelete = useCallback(async () => {
    if (dialogState.aiPromptRecord) {
      await deleteAiPromptAsync(dialogState.aiPromptRecord._id)
    }
  }, [deleteAiPromptAsync, dialogState])

  const value: AiPromptDialogContextType = useMemo(
    () => ({
      dialogState,
      openSaveDialog,
      openEditDialog,
      closeDialog,
    }),
    [dialogState, openSaveDialog, openEditDialog, closeDialog]
  )

  return (
    <AiPromptDialogContext.Provider value={value}>
      {children}
      <ManageAiPromptDialog
        type={dialogState.type}
        initialData={dialogState.initialData ?? {}}
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={handleSubmit}
        onDelete={dialogState.type === "edit" ? handleDelete : undefined}
      />
    </AiPromptDialogContext.Provider>
  )
}
AiPromptDialogProvider.displayName = "AiPromptDialogProvider"
