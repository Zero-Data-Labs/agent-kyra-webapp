import "@tanstack/react-query"
import { QueryKey } from "@tanstack/react-query"

interface CustomQueryMeta extends Record<string, unknown> {
  logCategory: string
  errorMessage: string
  persist?: boolean
}

interface CustomMutationMeta extends Record<string, unknown> {
  logCategory: string
  errorMessage: string
  onSettledInvalidationQueryKeys?: QueryKey
  onSuccessInvalidationQueryKeys?: QueryKey
  onErrorInvalidationQueryKeys?: QueryKey
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: CustomQueryMeta
    mutationMeta: CustomMutationMeta
  }
}
