import { QueryClient, type QueryKey } from "@tanstack/react-query"

import { Logger } from "@/features/telemetry/logger"

export function getLogger(logCategory?: string) {
  return Logger.create(logCategory || "queries")
}

export function invalidateQueries(
  queryClient: QueryClient,
  queryKeys: QueryKey,
  logger: Logger
) {
  logger.debug("Invalidating queries", { keys: queryKeys })
  queryClient.invalidateQueries({ queryKey: queryKeys }).then(() => {
    logger.debug("Successfully invalidated queries", { keys: queryKeys })
  })
}

export function logError(error: Error, logger: Logger, errorMessage?: string) {
  logger.error(errorMessage ? new Error(errorMessage, { cause: error }) : error)
}
