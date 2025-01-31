import { useCallback } from "react"

import { AiPromptBaseSchema } from "@/features/assistants/schemas"
import type { AiPromptBase } from "@/features/assistants/types"
import { AI_PROMPTS_DB_DEF } from "@/features/prompts/constants"
import { useToast } from "@/features/toasts/use-toast"
import { useCreateVeridaRecord } from "@/features/verida-database/hooks/use-create-verida-record"
import type { UnsavedVeridaRecord } from "@/features/verida-database/types"

export function useCreateAiPrompt() {
  const { toast } = useToast()

  const { createRecordAsync, createRecord, ...mutation } =
    useCreateVeridaRecord(AiPromptBaseSchema)

  const createAiPrompt = useCallback(
    (promptToSave: UnsavedVeridaRecord<AiPromptBase>) => {
      return createRecord(
        {
          databaseDefinition: AI_PROMPTS_DB_DEF,
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

  const createAiPromptAsync = useCallback(
    (promptToSave: UnsavedVeridaRecord<AiPromptBase>) => {
      return createRecordAsync(
        {
          databaseDefinition: AI_PROMPTS_DB_DEF,
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
    createAiPrompt,
    createAiPromptAsync,
    ...mutation,
  }
}
