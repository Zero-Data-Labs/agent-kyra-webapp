import { useCallback } from "react"

import { AiAssistantBaseSchema } from "@/features/assistants/schemas"
import type { AiAssistantBase } from "@/features/assistants/types"
import { AI_ASSISTANTS_DB_DEF } from "@/features/saved-agents/constants"
import { useToast } from "@/features/toasts/use-toast"
import { useCreateVeridaRecord } from "@/features/verida-database/hooks/use-create-verida-record"
import type { UnsavedVeridaRecord } from "@/features/verida-database/types"

export function useCreateAiAssistant() {
  const { toast } = useToast()

  const { createRecord, createRecordAsync, ...mutation } =
    useCreateVeridaRecord(AiAssistantBaseSchema)

  const createAiAssistant = useCallback(
    (assistantToSave: UnsavedVeridaRecord<AiAssistantBase>) => {
      return createRecord(
        {
          databaseDefinition: AI_ASSISTANTS_DB_DEF,
          record: assistantToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Assistant created successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Creating assistant failed",
            })
          },
        }
      )
    },
    [createRecord, toast]
  )

  const createAiAssistantAsync = useCallback(
    (assistantToSave: UnsavedVeridaRecord<AiAssistantBase>) => {
      return createRecordAsync(
        {
          databaseDefinition: AI_ASSISTANTS_DB_DEF,
          record: assistantToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Assistant created successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Creating assistant failed",
            })
          },
        }
      )
    },
    [createRecordAsync, toast]
  )

  return {
    createAiAssistant,
    createAiAssistantAsync,
    ...mutation,
  }
}
