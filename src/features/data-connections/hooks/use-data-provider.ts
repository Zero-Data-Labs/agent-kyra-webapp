import { useMemo } from "react"

import { useDataProviders } from "@/features/data-connections/hooks/use-data-providers"

export function useDataProvider(providerId: string) {
  const { providers, ...query } = useDataProviders()

  const provider = useMemo(
    () => providers?.find((provider) => provider.id === providerId),
    [providers, providerId]
  )

  return {
    provider,
    ...query,
  }
}
