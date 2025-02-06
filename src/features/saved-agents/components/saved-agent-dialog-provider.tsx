"use client"

import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { getAgentPageRoute } from "@/features/routes/utils"
import { ManageSavedAgentDialog } from "@/features/saved-agents/components/manage-saved-agent-dialog"
import {
  DEFAULT_AGENT,
  DEFAULT_AGENT_ORDER,
} from "@/features/saved-agents/constants"
import {
  SavedAgentDialogContext,
  type SavedAgentDialogContextType,
  type SavedAgentDialogState,
} from "@/features/saved-agents/contexts/saved-agent-dialog-context"
import { useCreateSavedAgent } from "@/features/saved-agents/hooks/use-create-saved-agent"
import { useDeleteSavedAgent } from "@/features/saved-agents/hooks/use-delete-saved-agent"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { useUpdateSavedAgent } from "@/features/saved-agents/hooks/use-update-saved-agent"
import type {
  SavedAgentFormData,
  SavedAgentRecord,
} from "@/features/saved-agents/types"

export type SavedAgentDialogProviderProps = {
  children: React.ReactNode
}

export function SavedAgentDialogProvider(props: SavedAgentDialogProviderProps) {
  const { children } = props

  const router = useRouter()

  const [dialogState, setDialogState] = useState<SavedAgentDialogState>({
    type: "create",
    isOpen: false,
  })

  const { selectedAgent } = useAgentChat()
  const { savedAgents } = useGetSavedAgents()
  const { createSavedAgentAsync } = useCreateSavedAgent()
  const { updateSavedAgentAsync } = useUpdateSavedAgent()
  const { deleteSavedAgentAsync } = useDeleteSavedAgent()

  const openCreateDialog = useCallback(
    (initialData?: Partial<SavedAgentFormData>) => {
      setDialogState({
        type: "create",
        isOpen: true,
        initialData,
      })
    },
    []
  )

  const openEditDialog = useCallback((savedAgentRecord: SavedAgentRecord) => {
    setDialogState({
      type: "edit",
      isOpen: true,
      initialData: {
        name: savedAgentRecord.name,
      },
      savedAgentRecord: savedAgentRecord,
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const handleSubmit = useCallback(
    async (data: SavedAgentFormData) => {
      if (dialogState.type === "create") {
        const newSavedAgentRecord = await createSavedAgentAsync({
          ...data,
          order: savedAgents
            ? Math.max(...savedAgents.map((a) => a.order ?? 0), 0) +
              DEFAULT_AGENT_ORDER
            : DEFAULT_AGENT_ORDER,
        })
        router.push(getAgentPageRoute({ agentId: newSavedAgentRecord._id }))
      } else if (dialogState.savedAgentRecord) {
        await updateSavedAgentAsync({
          ...dialogState.savedAgentRecord,
          ...data,
        })
      }
    },
    [
      createSavedAgentAsync,
      updateSavedAgentAsync,
      dialogState,
      router,
      savedAgents,
    ]
  )

  const handleDelete = useCallback(async () => {
    if (!dialogState.savedAgentRecord) {
      return
    }

    const savedAgentId = dialogState.savedAgentRecord._id
    const isCurrentAgent = savedAgentId === selectedAgent

    const nextAgentId = isCurrentAgent
      ? (savedAgents?.find((savedAgent) => savedAgent._id !== savedAgentId)
          ?._id ?? DEFAULT_AGENT._id)
      : (savedAgents?.find((savedAgent) => savedAgent._id === selectedAgent)
          ?._id ?? DEFAULT_AGENT._id)

    await deleteSavedAgentAsync(savedAgentId)

    router.push(
      getAgentPageRoute({
        agentId: nextAgentId,
        fromDeletion: true,
      })
    )
  }, [deleteSavedAgentAsync, dialogState, savedAgents, router, selectedAgent])

  const value: SavedAgentDialogContextType = useMemo(
    () => ({
      dialogState,
      openCreateDialog,
      openEditDialog,
      closeDialog,
    }),
    [dialogState, openCreateDialog, openEditDialog, closeDialog]
  )

  return (
    <SavedAgentDialogContext.Provider value={value}>
      {children}
      <ManageSavedAgentDialog
        type={dialogState.type}
        initialData={dialogState.initialData ?? {}}
        open={dialogState.isOpen}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={handleSubmit}
        onDelete={dialogState.type === "edit" ? handleDelete : undefined}
      />
    </SavedAgentDialogContext.Provider>
  )
}
SavedAgentDialogProvider.displayName = "SavedAgentDialogProvider"
