import { useCallback } from "react"

import { SAVED_PROMPTS_DB_DEF } from "@/features/saved-prompts/constants"
import { useToast } from "@/features/toasts/use-toast"
import { useDeleteVeridaRecord } from "@/features/verida-database/hooks/use-delete-verida-record"

export function useDeleteSavedPrompt() {
  const { toast } = useToast()

  const { deleteRecord, deleteRecordAsync, ...mutation } =
    useDeleteVeridaRecord()

  const deleteSavedPrompt = useCallback(
    (promptId: string) => {
      return deleteRecord(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          recordId: promptId,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt deleted successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Deleting prompt failed",
            })
          },
        }
      )
    },
    [deleteRecord, toast]
  )

  const deleteSavedPromptAsync = useCallback(
    (promptId: string) => {
      return deleteRecordAsync(
        {
          databaseDefinition: SAVED_PROMPTS_DB_DEF,
          recordId: promptId,
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              description: "Prompt deleted successfully",
            })
          },
          onError: () => {
            toast({
              variant: "error",
              description: "Deleting prompt failed",
            })
          },
        }
      )
    },
    [deleteRecordAsync, toast]
  )

  return {
    deleteSavedPrompt,
    deleteSavedPromptAsync,
    ...mutation,
  }
}
