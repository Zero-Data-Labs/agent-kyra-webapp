import { useCallback } from "react"

import { AGENTS_DB_DEF } from "@/features/saved-agents/constants"
import { SavedAgentBaseSchema } from "@/features/saved-agents/schemas"
import type { SavedAgentRecord } from "@/features/saved-agents/types"
import { useToast } from "@/features/toasts/use-toast"
import {
  type UseUpdateVeridaRecordOptions,
  useUpdateVeridaRecord,
} from "@/features/verida-database/hooks/use-update-verida-record"

export type UseUpdateSavedAgentOptions = UseUpdateVeridaRecordOptions

export function useUpdateSavedAgent(options: UseUpdateSavedAgentOptions = {}) {
  const { toast } = useToast()

  const { updateRecord, updateRecordAsync, ...mutation } =
    useUpdateVeridaRecord(SavedAgentBaseSchema, options)

  const updateSavedAgent = useCallback(
    (agentToUpdate: SavedAgentRecord) => {
      return updateRecord(
        {
          databaseDefinition: AGENTS_DB_DEF,
          record: agentToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating agent failed",
            })
          },
        }
      )
    },
    [updateRecord, toast]
  )

  const updateSavedAgentAsync = useCallback(
    (agentToUpdate: SavedAgentRecord) => {
      return updateRecordAsync(
        {
          databaseDefinition: AGENTS_DB_DEF,
          record: agentToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating agent failed",
            })
          },
        }
      )
    },
    [updateRecordAsync, toast]
  )

  return {
    updateSavedAgent,
    updateSavedAgentAsync,
    ...mutation,
  }
}
