import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { z } from "zod"

import type { UseQueryOptions } from "@/features/queries/types"
import { Logger } from "@/features/telemetry/logger"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { VeridaDatabaseQueryKeys } from "@/features/verida-database/queries"
import type {
  DatabaseDefinition,
  VeridaDatabaseQueryFilter,
  VeridaDatabaseQueryOptions,
  VeridaRecord,
} from "@/features/verida-database/types"
import { getVeridaRecords } from "@/features/verida-database/utils"

const logger = Logger.create("verida-database")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseVeridaRecordsArgs<T extends z.ZodObject<any>> = {
  databaseDefinition: DatabaseDefinition
  filter?: VeridaDatabaseQueryFilter<VeridaRecord<z.infer<T>>>
  options?: VeridaDatabaseQueryOptions<VeridaRecord<z.infer<T>>>
  baseSchema?: T
}

/**
 * Custom hook to fetch Verida data records.
 *
 * @param params - Hook parameters
 * @param params.databaseDefinition - The database to query
 * @param params.filter - Optional query filter to apply to the records
 * @param params.options - Optional query parameters (sort, limit, skip)
 * @param params.baseSchema - Optional base schema to extend the records with
 * @param queryOptions - Query options
 * @returns Query result object containing data, loading state, and error state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useVeridaRecords<T extends z.ZodObject<any>>(
  { databaseDefinition, filter, options, baseSchema }: UseVeridaRecordsArgs<T>,
  queryOptions?: UseQueryOptions
) {
  const { token } = useVeridaAuth()
  const queryClient = useQueryClient()

  const queryKey = useMemo(
    () =>
      VeridaDatabaseQueryKeys.records({
        databaseName: databaseDefinition.databaseVaultName,
        filter,
        options,
      }),
    [databaseDefinition, filter, options]
  )

  const { data, ...query } = useQuery({
    enabled: !!token && queryOptions?.enabled,
    queryKey,
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication token is required")
      }

      const result = await getVeridaRecords<T>({
        authToken: token,
        databaseDefinition,
        filter,
        options,
        baseSchema,
      })

      result.records.forEach((record) => {
        queryClient.setQueryData(
          VeridaDatabaseQueryKeys.record({
            databaseName: databaseDefinition.databaseVaultName,
            recordId: record._id,
          }),
          record
        )
      })

      return result
    },
    staleTime: queryOptions?.staleTime ?? 1000 * 60 * 1, // 1 minute
    gcTime: queryOptions?.gcTime ?? 1000 * 60 * 30, // 30 minutes
    meta: {
      logCategory: "verida-database",
      errorMessage: "Error fetching Verida records",
    },
  })

  return {
    records: data?.records,
    pagination: data?.pagination,
    queryKey,
    ...query,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrefetchVeridaRecordsArgs<T extends z.ZodObject<any>> = {
  queryClient: QueryClient
  authToken: string
  databaseDefinition: DatabaseDefinition
  filter?: VeridaDatabaseQueryFilter<VeridaRecord<z.infer<T>>>
  options?: VeridaDatabaseQueryOptions<VeridaRecord<z.infer<T>>>
  baseSchema?: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prefetchVeridaRecords<T extends z.ZodObject<any>>({
  queryClient,
  authToken,
  databaseDefinition,
  filter,
  options,
  baseSchema,
}: PrefetchVeridaRecordsArgs<T>) {
  logger.info("Prefetching Verida data records")

  await queryClient.prefetchQuery({
    queryKey: VeridaDatabaseQueryKeys.records({
      databaseName: databaseDefinition.databaseVaultName,
      filter,
      options,
    }),
    queryFn: async () => {
      const result = await getVeridaRecords<T>({
        authToken,
        databaseDefinition,
        filter,
        options,
        baseSchema,
      })

      result.records.forEach((record) => {
        queryClient.setQueryData(
          VeridaDatabaseQueryKeys.record({
            databaseName: databaseDefinition.databaseVaultName,
            recordId: record._id,
          }),
          record
        )
      })

      return result
    },
  })
}
