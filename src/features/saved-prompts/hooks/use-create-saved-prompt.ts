import { useCallback } from "react"

import { SAVED_PROMPTS_DB_DEF } from "@/features/saved-prompts/constants"
import { SavedPromptBaseSchema } from "@/features/saved-prompts/schemas"
import type { SavedPromptBase } from "@/features/saved-prompts/types"
import { useToast } from "@/features/toasts/use-toast"
import { useCreateVeridaRecord } from "@/features/verida-database/hooks/use-create-verida-record"
import type { UnsavedVeridaRecord } from "@/features/verida-database/types"

export function useCreateSavedPrompt() {
  const { toast } = useToast()

  const { createRecordAsync, createRecord, ...mutation } =
    useCreateVeridaRecord(SavedPromptBaseSchema)

  const createSavedPrompt = useCallback(
    (promptToSave: UnsavedVeridaRecord<SavedPromptBase>) => {
      return createRecord(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          record: promptToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt saved successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Saving prompt failed",
            })
          },
        }
      )
    },
    [createRecord, toast]
  )

  const createSavedPromptAsync = useCallback(
    (promptToSave: UnsavedVeridaRecord<SavedPromptBase>) => {
      return createRecordAsync(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          record: promptToSave,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt saved successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Saving prompt failed",
            })
          },
        }
      )
    },
    [createRecordAsync, toast]
  )

  return {
    createSavedPrompt,
    createSavedPromptAsync,
    ...mutation,
  }
}
