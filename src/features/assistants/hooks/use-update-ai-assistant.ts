import { useCallback } from "react"

import { AiAssistantBaseSchema } from "@/features/assistants/schemas"
import type { AiAssistantRecord } from "@/features/assistants/types"
import { AI_ASSISTANTS_DB_DEF } from "@/features/saved-agents/constants"
import { useToast } from "@/features/toasts/use-toast"
import {
  type UseUpdateVeridaRecordOptions,
  useUpdateVeridaRecord,
} from "@/features/verida-database/hooks/use-update-verida-record"

export type UseUpdateAiAssistantOptions = UseUpdateVeridaRecordOptions

export function useUpdateAiAssistant(
  options: UseUpdateAiAssistantOptions = {}
) {
  const { toast } = useToast()

  const { updateRecord, updateRecordAsync, ...mutation } =
    useUpdateVeridaRecord(AiAssistantBaseSchema, options)

  const updateAiAssistant = useCallback(
    (promptToUpdate: AiAssistantRecord) => {
      return updateRecord(
        {
          databaseDefinition: AI_ASSISTANTS_DB_DEF,
          record: promptToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Assistant updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating assistant failed",
            })
          },
        }
      )
    },
    [updateRecord, toast]
  )

  const updateAiAssistantAsync = useCallback(
    (promptToUpdate: AiAssistantRecord) => {
      return updateRecordAsync(
        {
          databaseDefinition: AI_ASSISTANTS_DB_DEF,
          record: promptToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Assistant updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating assistant failed",
            })
          },
        }
      )
    },
    [updateRecordAsync, toast]
  )

  return {
    updateAiAssistant,
    updateAiAssistantAsync,
    ...mutation,
  }
}
