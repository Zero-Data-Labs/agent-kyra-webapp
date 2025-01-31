"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import { ManageAiAssistantDialog } from "@/features/assistants/components/manage-ai-assistant-dialog"
import {
  DEFAULT_ASSISTANT,
  DEFAULT_ASSISTANT_ORDER,
} from "@/features/assistants/constants"
import {
  AiAssistantDialogContext,
  type AiAssistantDialogContextType,
  type AiAssistantDialogState,
} from "@/features/assistants/contexts/ai-assistant-dialog-context"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { useCreateAiAssistant } from "@/features/assistants/hooks/use-create-ai-assistant"
import { useDeleteAiAssistant } from "@/features/assistants/hooks/use-delete-ai-assistant"
import { useGetAiAssistants } from "@/features/assistants/hooks/use-get-ai-assistants"
import { useUpdateAiAssistant } from "@/features/assistants/hooks/use-update-ai-assistant"
import type {
  AiAssistantFormData,
  AiAssistantRecord,
} from "@/features/assistants/types"
import { getAgentPageRoute } from "@/features/routes/utils"

type AiAssistantDialogProviderProps = {
  children: React.ReactNode
}

export function AiAssistantDialogProvider(
  props: AiAssistantDialogProviderProps
) {
  const { children } = props

  const router = useRouter()

  const [dialogState, setDialogState] = useState<AiAssistantDialogState>({
    type: "create",
    isOpen: false,
  })

  const { selectedAiAssistant } = useAssistants()
  const { aiAssistants } = useGetAiAssistants()
  const { createAiAssistantAsync } = useCreateAiAssistant()
  const { updateAiAssistantAsync } = useUpdateAiAssistant()
  const { deleteAiAssistantAsync } = useDeleteAiAssistant()

  const openCreateDialog = useCallback(
    (initialData?: Partial<AiAssistantFormData>) => {
      setDialogState({
        type: "create",
        isOpen: true,
        initialData,
      })
    },
    []
  )

  const openEditDialog = useCallback((aiAssistantRecord: AiAssistantRecord) => {
    setDialogState({
      type: "edit",
      isOpen: true,
      initialData: {
        name: aiAssistantRecord.name,
      },
      aiAssistantRecord,
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleSubmit = useCallback(
    async (data: AiAssistantFormData) => {
      if (dialogState.type === "create") {
        const newAssistantRecord = await createAiAssistantAsync({
          ...data,
          order: aiAssistants
            ? Math.max(...aiAssistants.map((a) => a.order ?? 0), 0) +
              DEFAULT_ASSISTANT_ORDER
            : DEFAULT_ASSISTANT_ORDER,
        })
        router.push(getAgentPageRoute({ agentId: newAssistantRecord._id }))
      } else if (dialogState.aiAssistantRecord) {
        await updateAiAssistantAsync({
          ...dialogState.aiAssistantRecord,
          ...data,
        })
      }
    },
    [
      createAiAssistantAsync,
      updateAiAssistantAsync,
      dialogState,
      router,
      aiAssistants,
    ]
  )

  const handleDelete = useCallback(async () => {
    if (!dialogState.aiAssistantRecord) {
      return
    }

    const assistantId = dialogState.aiAssistantRecord._id
    const isCurrentAssistant = assistantId === selectedAiAssistant

    const nextAssistantId = isCurrentAssistant
      ? (aiAssistants?.find((assistant) => assistant._id !== assistantId)
          ?._id ?? DEFAULT_ASSISTANT._id)
      : (aiAssistants?.find(
          (assistant) => assistant._id === selectedAiAssistant
        )?._id ?? DEFAULT_ASSISTANT._id)

    await deleteAiAssistantAsync(assistantId)

    router.push(
      getAgentPageRoute({
        agentId: nextAssistantId,
        fromDeletion: true,
      })
    )
  }, [
    deleteAiAssistantAsync,
    dialogState,
    aiAssistants,
    router,
    selectedAiAssistant,
  ])

  const value: AiAssistantDialogContextType = useMemo(
    () => ({
      dialogState,
      openCreateDialog,
      openEditDialog,
      closeDialog,
    }),
    [dialogState, openCreateDialog, openEditDialog, closeDialog]
  )

  return (
    <AiAssistantDialogContext.Provider value={value}>
      {children}
      <ManageAiAssistantDialog
        type={dialogState.type}
        initialData={dialogState.initialData ?? {}}
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={handleSubmit}
        onDelete={dialogState.type === "edit" ? handleDelete : undefined}
      />
    </AiAssistantDialogContext.Provider>
  )
}
AiAssistantDialogProvider.displayName = "AiAssistantDialogProvider"
