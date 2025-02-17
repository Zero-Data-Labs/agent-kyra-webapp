import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { VeridaDatabaseQueryKeys } from "@/features/verida-database/queries"
import type {
  DatabaseDefinition,
  FetchVeridaRecordsResult,
  VeridaRecord,
} from "@/features/verida-database/types"
import { deleteVeridaRecord } from "@/features/verida-database/utils"

type UseDeleteVeridaRecordOptions = {
  disableOptimisticUpdate?: boolean
}

type DeleteVeridaRecordArgs = {
  databaseDefinition: DatabaseDefinition
  recordId: string
}

type UseDeleteMutationContext = {
  previousRecordData: VeridaRecord | undefined
  previousRecordsData: [QueryKey, FetchVeridaRecordsResult | undefined][]
}

export function useDeleteVeridaRecord(
  options: UseDeleteVeridaRecordOptions = {}
) {
  const { authDetails } = useVeridaAuth()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...mutation } = useMutation<
    void,
    Error,
    DeleteVeridaRecordArgs,
    UseDeleteMutationContext
  >({
    mutationFn: async ({ databaseDefinition, recordId }) => {
      if (!authDetails?.token) {
        throw new Error("Authentication token is required")
      }

      return deleteVeridaRecord({
        authToken: authDetails.token,
        databaseDefinition,
        recordId,
      })
    },
    onMutate: async ({ databaseDefinition, recordId }) => {
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
      const previousRecordsData =
        queryClient.getQueriesData<FetchVeridaRecordsResult>({
          queryKey: VeridaDatabaseQueryKeys.invalidateRecords({
            databaseName: databaseDefinition.databaseVaultName,
          }),
        })

      // Optimistically update all matching queries
      previousRecordsData.forEach(([queryKey, queryData]) => {
        if (queryData) {
          queryClient.setQueryData(queryKey, {
            records: queryData.records.filter((r) => r._id !== recordId),
            pagination: {
              // pagination.skipped may not be correct depending on which page
              // the deleted record was but it's the best we can do
              ...queryData.pagination,
              unfilteredTotalRecordsCount: queryData.pagination
                .unfilteredTotalRecordsCount
                ? queryData.pagination.unfilteredTotalRecordsCount - 1
                : null,
            },
          })
        }
      })

      // Snapshot the previous value for the individual record
      const previousRecordData = queryClient.getQueryData<VeridaRecord>(
        VeridaDatabaseQueryKeys.record({
          databaseName: databaseDefinition.databaseVaultName,
          recordId,
        })
      )

      if (previousRecordData) {
        queryClient.removeQueries({
          queryKey: VeridaDatabaseQueryKeys.record({
            databaseName: databaseDefinition.databaseVaultName,
            recordId,
          }),
        })
      }

      return {
        previousRecordsData,
        previousRecordData,
      }
    },
    onError: (_error, { databaseDefinition, recordId }, context) => {
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
            recordId,
          }),
          context.previousRecordData
        )
      }
    },
    onSuccess: (_data, { databaseDefinition, recordId }) => {
      queryClient.invalidateQueries({
        queryKey: VeridaDatabaseQueryKeys.invalidateRecords({
          databaseName: databaseDefinition.databaseVaultName,
        }),
      })

      queryClient.removeQueries({
        queryKey: VeridaDatabaseQueryKeys.record({
          databaseName: databaseDefinition.databaseVaultName,
          recordId,
        }),
      })
    },
    meta: {
      logCategory: "verida-database",
      errorMessage: "Error deleting Verida record",
    },
  })

  return {
    deleteRecord: mutate,
    deleteRecordAsync: mutateAsync,
    ...mutation,
  }
}
