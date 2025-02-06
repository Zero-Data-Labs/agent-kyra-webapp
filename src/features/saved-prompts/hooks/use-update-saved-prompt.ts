import { useCallback } from "react"

import { SAVED_PROMPTS_DB_DEF } from "@/features/saved-prompts/constants"
import { SavedPromptBaseSchema } from "@/features/saved-prompts/schemas"
import type { SavedPromptRecord } from "@/features/saved-prompts/types"
import { useToast } from "@/features/toasts/use-toast"
import {
  type UseUpdateVeridaRecordOptions,
  useUpdateVeridaRecord,
} from "@/features/verida-database/hooks/use-update-verida-record"

export type UseUpdateSavedPromptOptions = UseUpdateVeridaRecordOptions

export function useUpdateSavedPrompt(
  options: UseUpdateSavedPromptOptions = {}
) {
  const { toast } = useToast()

  const { updateRecordAsync, updateRecord, ...mutation } =
    useUpdateVeridaRecord(SavedPromptBaseSchema, options)

  const updateSavedPrompt = useCallback(
    (promptToUpdate: SavedPromptRecord) => {
      return updateRecord(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          record: promptToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating prompt failed",
            })
          },
        }
      )
    },
    [updateRecord, toast]
  )

  const updateSavedPromptAsync = useCallback(
    (promptToUpdate: SavedPromptRecord) => {
      return updateRecordAsync(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          record: promptToUpdate,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt updated successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Updating prompt failed",
            })
          },
        }
      )
    },
    [updateRecordAsync, toast]
  )

  return {
    updateSavedPrompt,
    updateSavedPromptAsync,
    ...mutation,
  }
}
