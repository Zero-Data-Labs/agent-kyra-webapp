export const DataConnectionsQueryKeys = {
  dataConnections: ({ did }: { did: string | null }) => [
    "data-connections",
    "connections",
    did,
  ],
  invalidateDataConnections: () => ["data-connections", "connections"],
  dataProviders: () => ["data-connections", "providers"],
  invalidateDataProviders: () => ["data-connections", "providers"],
}
