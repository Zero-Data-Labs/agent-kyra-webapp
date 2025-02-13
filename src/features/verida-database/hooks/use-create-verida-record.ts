import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { VeridaDatabaseQueryKeys } from "@/features/verida-database/queries"
import type {
  DatabaseDefinition,
  UnsavedVeridaRecord,
  VeridaRecord,
} from "@/features/verida-database/types"
import { createVeridaRecord } from "@/features/verida-database/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateRecordArgs<T extends z.ZodObject<any>> = {
  databaseDefinition: DatabaseDefinition
  record: UnsavedVeridaRecord<z.infer<T>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCreateVeridaRecord<T extends z.ZodObject<any>>(
  baseSchema?: T
) {
  const { authDetails } = useVeridaAuth()
  const queryClient = useQueryClient()

  // TODO: Add optimistic update. Have to deal with a temporary id though

  const { mutate, mutateAsync, ...mutation } = useMutation<
    VeridaRecord<z.infer<T>>,
    Error,
    CreateRecordArgs<T>
  >({
    mutationFn: async ({ databaseDefinition, record }) => {
      if (!authDetails?.token) {
        throw new Error("Authentication token is required")
      }

      return createVeridaRecord<T>({
        authToken: authDetails.token,
        databaseDefinition,
        record,
        baseSchema,
      })
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
      errorMessage: "Error creating Verida record",
    },
  })

  return {
    createRecord: mutate,
    createRecordAsync: mutateAsync,
    ...mutation,
  }
}
