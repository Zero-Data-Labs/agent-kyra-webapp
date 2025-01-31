import { AI_ASSISTANTS_DB_DEF } from "@/features/agents/constants"
import { AiAssistantBaseSchema } from "@/features/assistants/schemas"
import type { UseQueryOptions } from "@/features/queries/types"
import { useVeridaRecord } from "@/features/verida-database/hooks/use-verida-record"

type UseGetAiAssistantArgs = {
  assistantId: string
}

export function useGetAiAssistant(
  { assistantId }: UseGetAiAssistantArgs,
  queryOptions?: UseQueryOptions
) {
  const { record, ...query } = useVeridaRecord(
    {
      databaseDefinition: AI_ASSISTANTS_DB_DEF,
      recordId: assistantId,
      baseSchema: AiAssistantBaseSchema,
    },
    queryOptions
  )

  return {
    aiAssistant: record,
    ...query,
  }
}
