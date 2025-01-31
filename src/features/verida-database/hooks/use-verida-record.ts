import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { z } from "zod"

import type { UseQueryOptions } from "@/features/queries/types"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { VeridaDatabaseQueryKeys } from "@/features/verida-database/queries"
import type { DatabaseDefinition } from "@/features/verida-database/types"
import { getVeridaRecord } from "@/features/verida-database/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseVeridaRecordArgs<T extends z.ZodObject<any>> = {
  databaseDefinition: DatabaseDefinition
  recordId: string
  baseSchema?: T
}

/**
 * Custom hook to fetch a single Verida data record.
 *
 * @param params - Hook parameters
 * @param params.databaseDefinition - The database to query
 * @param params.recordId - The ID of the record to fetch
 * @param params.baseSchema - Optional base schema to extend the record with
 * @param queryOptions - Query options
 * @returns Query result object containing data, loading state, and error state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useVeridaRecord<T extends z.ZodObject<any>>(
  { databaseDefinition, recordId, baseSchema }: UseVeridaRecordArgs<T>,
  queryOptions?: UseQueryOptions
) {
  const { token } = useVeridaAuth()

  const queryKey = useMemo(
    () =>
      VeridaDatabaseQueryKeys.record({
        databaseName: databaseDefinition.databaseVaultName,
        recordId,
      }),
    [databaseDefinition, recordId]
  )

  const { data, ...query } = useQuery({
    enabled: !!token && queryOptions?.enabled,
    queryKey,
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication token is required")
      }

      return getVeridaRecord<T>({
        authToken: token,
        databaseDefinition,
        recordId,
        baseSchema,
      })
    },
    staleTime: queryOptions?.staleTime ?? 1000 * 60 * 1, // 1 minute
    gcTime: queryOptions?.gcTime ?? 1000 * 60 * 30, // 30 minutes
    meta: {
      logCategory: "verida-database",
      errorMessage: "Error fetching a Verida record",
    },
  })

  return {
    record: data,
    ...query,
  }
}
