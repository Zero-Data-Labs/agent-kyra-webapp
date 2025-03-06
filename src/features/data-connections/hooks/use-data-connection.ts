import { useMemo } from "react"

import { useDataConnections } from "@/features/data-connections/hooks/use-data-connections"
import { getDataConnectionLatestSyncEnd } from "@/features/data-connections/utils"

export function useDataConnection(connectionName: string) {
  const {
    connections,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isAnySyncing, // destructure to remove it from query
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    latestSync: latestConnectionsSync, // destructure to remove it from query
    ...query
  } = useDataConnections()

  const connection = useMemo(
    () => connections?.find((connection) => connection._id === connectionName),
    [connections, connectionName]
  )

  const isSyncing = useMemo(() => {
    return connection?.syncStatus === "active"
  }, [connection])

  const latestSync = useMemo(() => {
    if (!connection) {
      return undefined
    }

    return getDataConnectionLatestSyncEnd(connection)
  }, [connection])

  return {
    connection,
    isSyncing,
    latestSync,
    ...query,
  }
}
