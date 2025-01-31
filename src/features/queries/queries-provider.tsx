"use client"

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client"

import {
  getLogger,
  invalidateQueries,
  logError,
} from "@/features/queries/utils"

const PERSISTENCE_MAX_AGE = 1000 * 60 * 60 * 24 * 5 // 5 days
const GC_TIME = Infinity

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      gcTime: GC_TIME,
      retry: 2,
    },
  },
  queryCache: new QueryCache({
    onError: (cause, query) => {
      const logger = getLogger(query.meta?.logCategory)
      logError(cause, logger, query.meta?.errorMessage)
    },
  }),
  mutationCache: new MutationCache({
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const logger = getLogger(mutation.meta?.logCategory)

      const keys = mutation.meta?.onSettledInvalidationQueryKeys
      if (keys) {
        invalidateQueries(queryClient, keys, logger)
      }
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      const logger = getLogger(mutation.meta?.logCategory)

      const keys = mutation.meta?.onSuccessInvalidationQueryKeys
      if (keys) {
        invalidateQueries(queryClient, keys, logger)
      }
    },
    onError: (cause, _variables, _context, mutation) => {
      const logger = getLogger(mutation.meta?.logCategory)

      const keys = mutation.meta?.onErrorInvalidationQueryKeys
      if (keys) {
        invalidateQueries(queryClient, keys, logger)
      }

      logError(cause, logger, mutation.meta?.errorMessage)
    },
  }),
})

// For security reasons, do not persist user's private data
const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
  retry: removeOldestQuery,
})

export interface QueriesProviderProps {
  children: React.ReactNode
}

export function QueriesProvider(props: QueriesProviderProps) {
  const { children } = props

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: PERSISTENCE_MAX_AGE,
        persister: localStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery(query) {
            // Only persist queries that explicitly opt-in
            if (!query.meta?.persist) {
              return false
            }
            // If data is stale, don't dehydrate it so it will trigger a fresh fetch
            if (query.isStale()) {
              return false
            }

            return true
          },
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  )
}
QueriesProvider.displayName = "QueriesProvider"
