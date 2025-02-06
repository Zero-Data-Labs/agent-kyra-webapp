import { useCallback } from "react"

import { AGENTS_DB_DEF } from "@/features/saved-agents/constants"
import { SavedAgentBaseSchema } from "@/features/saved-agents/schemas"
import type { SavedAgentBase } from "@/features/saved-agents/types"
import { useToast } from "@/features/toasts/use-toast"
import { useCreateVeridaRecord } from "@/features/verida-database/hooks/use-create-verida-record"
import type { UnsavedVeridaRecord } from "@/features/verida-database/types"

export function useCreateSavedAgent() {
  const { toast } = useToast()

  const { createRecord, createRecordAsync, ...mutation } =
    useCreateVeridaRecord(SavedAgentBaseSchema)

  const createSavedAgent = useCallback(
    (agentToSave: UnsavedVeridaRecord<SavedAgentBase>) => {
      return createRecord(
        {
          databaseDefinition: AGENTS_DB_DEF,
          record: agentToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent created successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Creating agent failed",
            })
          },
        }
      )
    },
    [createRecord, toast]
  )

  const createSavedAgentAsync = useCallback(
    (agentToSave: UnsavedVeridaRecord<SavedAgentBase>) => {
      return createRecordAsync(
        {
          databaseDefinition: AGENTS_DB_DEF,
          record: agentToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Agent created successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Creating agent failed",
            })
          },
        }
      )
    },
    [createRecordAsync, toast]
  )

  return {
    createSavedAgent,
    createSavedAgentAsync,
    ...mutation,
  }
}
