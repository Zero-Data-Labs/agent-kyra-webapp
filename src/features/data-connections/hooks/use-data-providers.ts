import { QueryClient, useQuery } from "@tanstack/react-query"

import { DataConnectionsQueryKeys } from "@/features/data-connections/queries"
import { getDataProviders } from "@/features/data-connections/utils"
import { Logger } from "@/features/telemetry/logger"

const logger = Logger.create("data-connections")

export function useDataProviders() {
  const { data, ...query } = useQuery({
    queryKey: DataConnectionsQueryKeys.dataProviders(),
    queryFn: getDataProviders,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    meta: {
      persist: true,
      logCategory: "data-connections",
      errorMessage: "Error fetching data providers",
    },
  })

  return {
    providers: data,
    ...query,
  }
}

export async function prefetchDataProviders(queryClient: QueryClient) {
  logger.info("Prefetching data providers")
  await queryClient.prefetchQuery({
    queryKey: DataConnectionsQueryKeys.dataProviders(),
    queryFn: getDataProviders,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    meta: {
      persist: true,
      logCategory: "data-connections",
      errorMessage: "Error fetching data providers",
    },
  })
}
