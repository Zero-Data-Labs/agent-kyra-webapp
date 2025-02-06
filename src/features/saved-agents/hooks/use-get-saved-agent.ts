import type { UseQueryOptions } from "@/features/queries/types"
import { AGENTS_DB_DEF } from "@/features/saved-agents/constants"
import { SavedAgentBaseSchema } from "@/features/saved-agents/schemas"
import { useVeridaRecord } from "@/features/verida-database/hooks/use-verida-record"

type UseGetSavedAgentArgs = {
  agentId: string
}

export function useGetSavedAgent(
  { agentId }: UseGetSavedAgentArgs,
  queryOptions?: UseQueryOptions
) {
  const { record, ...query } = useVeridaRecord(
    {
      databaseDefinition: AGENTS_DB_DEF,
      recordId: agentId,
      baseSchema: SavedAgentBaseSchema,
    },
    queryOptions
  )

  return {
    savedAgent: record,
    ...query,
  }
}
