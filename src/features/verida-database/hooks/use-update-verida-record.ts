import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { z } from "zod"

import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { VeridaDatabaseQueryKeys } from "@/features/verida-database/queries"
import type {
  DatabaseDefinition,
  FetchVeridaRecordsResult,
  VeridaRecord,
} from "@/features/verida-database/types"
import { updateVeridaRecord } from "@/features/verida-database/utils"

export type UseUpdateVeridaRecordOptions = {
  disableOptimisticUpdate?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateRecordArgs<T extends z.ZodObject<any>> = {
  databaseDefinition: DatabaseDefinition
  record: VeridaRecord<z.infer<T>>
}

type UseUpdateMutationContext = {
  previousRecordData: VeridaRecord | undefined
  previousRecordsData: [QueryKey, FetchVeridaRecordsResult | undefined][]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUpdateVeridaRecord<T extends z.ZodObject<any>>(
  baseSchema?: T,
  options: UseUpdateVeridaRecordOptions = {}
) {
  const { token } = useVeridaAuth()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<
    VeridaRecord<z.infer<T>>,
    Error,
    UpdateRecordArgs<T>,
    UseUpdateMutationContext
  >({
    mutationFn: async ({ databaseDefinition, record }) => {
      if (!token) {
        throw new Error("Authentication token is required")
      }

      return updateVeridaRecord<T>({
        authToken: token,
        databaseDefinition,
        record,
        baseSchema,
      })
    },
    onMutate: async ({ databaseDefinition, record }) => {
      if (options.disableOptimisticUpdate) {
        return {
          previousRecordsData: [],
          previousRecordData: undefined,
        }
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: VeridaDatabaseQueryKeys.invalidateRecords({
          databaseName: databaseDefinition.databaseVaultName,
        }),
      })

      // Snapshot the previous values for all queries matching the data records key
      const previousRecordsData = queryClient.getQueriesData<
        FetchVeridaRecordsResult<z.infer<T>>
      >({
        queryKey: VeridaDatabaseQueryKeys.invalidateRecords({
          databaseName: databaseDefinition.databaseVaultName,
        }),
      })

      // Optimistically update all matching queries
      previousRecordsData.forEach(([queryKey, queryData]) => {
        if (queryData) {
          queryClient.setQueryData(queryKey, {
            ...queryData,
            records: queryData.records.map((r) =>
              r._id === record._id ? { ...r, ...record } : r
            ),
          })
        }
      })

      // Snapshot the previous value for the individual record
      const previousRecordData = queryClient.getQueryData<
        VeridaRecord<z.infer<T>>
      >(
        VeridaDatabaseQueryKeys.record({
          databaseName: databaseDefinition.databaseVaultName,
          recordId: record._id,
        })
      )

      // Optimistically update to the new value for the individual record
      if (previousRecordData) {
        queryClient.setQueryData(
          VeridaDatabaseQueryKeys.record({
            databaseName: databaseDefinition.databaseVaultName,
            recordId: record._id,
          }),
          {
            ...previousRecordData,
            ...record,
          }
        )
      }

      // Return a context object with the snapshotted values
      return { previousRecordsData, previousRecordData }
    },
    onError: (_error, { databaseDefinition, record }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back the optimistic updates

      if (context?.previousRecordsData) {
        context.previousRecordsData.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData)
        })
      }

      if (context?.previousRecordData) {
        queryClient.setQueryData(
          VeridaDatabaseQueryKeys.record({
            databaseName: databaseDefinition.databaseVaultName,
            recordId: record._id,
          }),
          context.previousRecordData
        )
      }
    },
    onSuccess: (data, { databaseDefinition }) => {
      queryClient.invalidateQueries({
        queryKey: VeridaDatabaseQueryKeys.invalidateRecords({
          databaseName: databaseDefinition.databaseVaultName,
        }),
      })

      queryClient.setQueryData(
        VeridaDatabaseQueryKeys.record({
          databaseName: databaseDefinition.databaseVaultName,
          recordId: data._id,
        }),
        data
      )
    },
    meta: {
      logCategory: "verida-database",
      errorMessage: "Error updating Verida record",
    },
  })

  return {
    updateRecord: mutate,
    updateRecordAsync: mutateAsync,
    ...mutation,
  }
}
