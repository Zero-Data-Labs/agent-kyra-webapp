import { useCallback } from "react"

import { AGENTS_DB_DEF } from "@/features/saved-agents/constants"
import { useToast } from "@/features/toasts/use-toast"
import { useDeleteVeridaRecord } from "@/features/verida-database/hooks/use-delete-verida-record"

export function useDeleteSavedAgent() {
  const { toast } = useToast()

  const { deleteRecord, deleteRecordAsync, ...mutation } =
    useDeleteVeridaRecord()

  const deleteSavedAgent = useCallback(
    (agentId: string) => {
      return deleteRecord(
        {
          databaseDefinition: AGENTS_DB_DEF,
          recordId: agentId,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent deleted successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Deleting agent failed",
            })
          },
        }
      )
    },
    [deleteRecord, toast]
  )

  const deleteSavedAgentAsync = useCallback(
    (agentId: string) => {
      return deleteRecordAsync(
        {
          databaseDefinition: AGENTS_DB_DEF,
          recordId: agentId,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent deleted successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Deleting agent failed",
            })
          },
        }
      )
    },
    [deleteRecordAsync, toast]
  )

  return {
    deleteSavedAgent,
    deleteSavedAgentAsync,
    ...mutation,
  }
}
