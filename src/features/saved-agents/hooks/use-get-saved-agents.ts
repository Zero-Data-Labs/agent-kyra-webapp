import { useMemo } from "react"

import { MAX_NB_AGENTS } from "@/features/saved-agents/constants"
import { AGENTS_DB_DEF } from "@/features/saved-agents/constants"
import { SavedAgentBaseSchema } from "@/features/saved-agents/schemas"
import {
  type PrefetchVeridaRecordsArgs,
  type UseVeridaRecordsArgs,
  prefetchVeridaRecords,
  useVeridaRecords,
} from "@/features/verida-database/hooks/use-verida-records"

type UseGetuseGetSavedAgentsArgs = Pick<
  UseVeridaRecordsArgs<typeof SavedAgentBaseSchema>,
  "filter" | "options"
>

export function useGetSavedAgents({
  filter,
  options,
}: UseGetuseGetSavedAgentsArgs = {}) {
  const { records, ...query } = useVeridaRecords({
    databaseDefinition: AGENTS_DB_DEF,
    baseSchema: SavedAgentBaseSchema,
    filter,
    options: {
      ...options,
      limit: options?.limit ?? MAX_NB_AGENTS,
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
    savedAgents: sortedRecords,
    ...query,
  }
}

type PrefetchSavedAgentsArgs = Omit<
  PrefetchVeridaRecordsArgs<typeof SavedAgentBaseSchema>,
  "databaseDefinition" | "baseSchema"
>

export async function prefetchSavedAgents({
  queryClient,
  authToken,
  filter,
  options,
}: PrefetchSavedAgentsArgs) {
  await prefetchVeridaRecords({
    queryClient,
    authToken,
    databaseDefinition: AGENTS_DB_DEF,
    baseSchema: SavedAgentBaseSchema,
    filter,
    options,
  })
}
