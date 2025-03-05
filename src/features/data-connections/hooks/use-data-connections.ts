import { QueryClient, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { DataConnectionsQueryKeys } from "@/features/data-connections/queries"
import {
  getDataConnections,
  getDataConnectionsLatestSyncEnd,
} from "@/features/data-connections/utils"
import { Logger } from "@/features/telemetry/logger"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

const logger = Logger.create("data-connections")

export function useDataConnections() {
  const { authDetails } = useVeridaAuth()

  const { data, ...query } = useQuery({
    enabled: !!authDetails?.did,
    queryKey: DataConnectionsQueryKeys.dataConnections({
      did: authDetails?.did ?? null,
    }),
    queryFn: async () => {
      if (!authDetails?.token) {
        throw new Error("Authentication token is required")
      }

      return getDataConnections(authDetails.token)
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    // TODO: Can increase the stale time once the status is fetched separately
    // as the connections definition won't change much unless mutated which can
    // invalidate the cache
    gcTime: 1000 * 60 * 30, // 30 minutes
    meta: {
      logCategory: "data-connections",
      errorMessage: "Error fetching data connections",
    },
  })

  const isAnySyncing = useMemo(() => {
    return data?.some((connection) => connection.syncStatus === "active")
  }, [data])

  const latestSync = useMemo(() => {
    if (!data) {
      return undefined
    }

    return getDataConnectionsLatestSyncEnd(data)
  }, [data])

  return {
    connections: data,
    isAnySyncing,
    latestSync,
    ...query,
  }
}

export async function prefetchDataConnections(
  queryClient: QueryClient,
  did: string | null,
  sessionToken: string
) {
  if (!did) {
    return
  }

  logger.info("Prefetching data connections")
  await queryClient.prefetchQuery({
    queryKey: DataConnectionsQueryKeys.dataConnections({ did }),
    queryFn: async () => {
      return getDataConnections(sessionToken)
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    // TODO: Can increase the stale time once the status is fetched separately
    // as the connections definition won't change much unless mutated which can
    // invalidate the cache
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}
