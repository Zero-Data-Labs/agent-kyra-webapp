import { useMemo } from "react"

import { MAX_NB_PROMPTS_PER_ASSISTANT } from "@/features/assistants/constants"
import { AiPromptBaseSchema } from "@/features/assistants/schemas"
import { AI_PROMPTS_DB_DEF } from "@/features/prompts/constants"
import {
  type PrefetchVeridaRecordsArgs,
  type UseVeridaRecordsArgs,
  prefetchVeridaRecords,
  useVeridaRecords,
} from "@/features/verida-database/hooks/use-verida-records"

type UseGetAiPromptsArgs = Pick<
  UseVeridaRecordsArgs<typeof AiPromptBaseSchema>,
  "filter" | "options"
>

export function useGetAiPrompts({ filter, options }: UseGetAiPromptsArgs = {}) {
  const { records, ...query } = useVeridaRecords({
    databaseDefinition: AI_PROMPTS_DB_DEF,
    baseSchema: AiPromptBaseSchema,
    filter,
    options: {
      ...options,
      limit: options?.limit ?? MAX_NB_PROMPTS_PER_ASSISTANT,
    },
  })

  const sortedRecords = useMemo(() => {
    return records?.sort((a, b) => {
      // Sort by order first if both have order defined
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      // Put records with order before those without
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1

      // Fall back to insertedAt if both exist
      if (a.insertedAt && b.insertedAt) {
        return (
          new Date(b.insertedAt).getTime() - new Date(a.insertedAt).getTime()
        )
      }
      // Put records with insertedAt before those without
      if (a.insertedAt) return -1
      if (b.insertedAt) return 1

      return 0
    })
  }, [records])

  return {
    aiPrompts: sortedRecords,
    ...query,
  }
}

type PrefetchGetAiPromptsArgs = Omit<
  PrefetchVeridaRecordsArgs<typeof AiPromptBaseSchema>,
  "databaseDefinition" | "baseSchema"
>

export async function prefetchGetAiPrompts({
  queryClient,
  authToken,
  filter,
  options,
}: PrefetchGetAiPromptsArgs) {
  await prefetchVeridaRecords({
    queryClient,
    authToken,
    databaseDefinition: AI_PROMPTS_DB_DEF,
    baseSchema: AiPromptBaseSchema,
    filter,
    options,
  })
}
