import { useMemo } from "react"

import { MAX_NB_SAVED_PROMPTS_PER_AGENT } from "@/features/saved-prompts/constants"
import { SAVED_PROMPTS_DB_DEF } from "@/features/saved-prompts/constants"
import { SavedPromptBaseSchema } from "@/features/saved-prompts/schemas"
import {
  type PrefetchVeridaRecordsArgs,
  type UseVeridaRecordsArgs,
  prefetchVeridaRecords,
  useVeridaRecords,
} from "@/features/verida-database/hooks/use-verida-records"

type UseGetSavedPromptsArgs = Pick<
  UseVeridaRecordsArgs<typeof SavedPromptBaseSchema>,
  "filter" | "options"
>

export function useGetSavedPrompts({
  filter,
  options,
}: UseGetSavedPromptsArgs = {}) {
  const { records, ...query } = useVeridaRecords({
    databaseDefinition: SAVED_PROMPTS_DB_DEF,
    baseSchema: SavedPromptBaseSchema,
    filter,
    options: {
      ...options,
      limit: options?.limit ?? MAX_NB_SAVED_PROMPTS_PER_AGENT,
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
    savedPrompts: sortedRecords,
    ...query,
  }
}

type PrefetchGetSavedPromptsArgs = Omit<
  PrefetchVeridaRecordsArgs<typeof SavedPromptBaseSchema>,
  "databaseDefinition" | "baseSchema"
>

export async function prefetchGetSavedPrompts({
  queryClient,
  authToken,
  filter,
  options,
}: PrefetchGetSavedPromptsArgs) {
  await prefetchVeridaRecords({
    queryClient,
    authToken,
    databaseDefinition: SAVED_PROMPTS_DB_DEF,
    baseSchema: SavedPromptBaseSchema,
    filter,
    options,
  })
}
