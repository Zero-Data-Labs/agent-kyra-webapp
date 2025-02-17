import { QueryClient, useQuery } from "@tanstack/react-query"

import { Logger } from "@/features/telemetry/logger"
import { fetchVeridaProfile } from "@/features/verida-profile/utils"

const logger = Logger.create("verida-profile")

type UseVeridaProfileArgs = {
  did: string | null | undefined
}

export function useVeridaProfile({ did }: UseVeridaProfileArgs) {
  const { data, ...query } = useQuery({
    queryKey: ["verida", "profile", did],
    enabled: !!did,
    queryFn: () => {
      if (!did) {
        // To satisfy the type checker
        // Should not happen as the hook is disabled if !did
        throw new Error("DID is required")
      }

      return fetchVeridaProfile({
        did,
      })
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      persist: true,
      logCategory: "verida-profile",
      errorMessage: "Failed to fetch Verida profile",
    },
  })

  return {
    profile: data,
    ...query,
  }
}

export async function invalidateVeridaProfile(
  queryClient: QueryClient,
  did: string
) {
  await queryClient.invalidateQueries({ queryKey: ["verida", "profile", did] })
  logger.info("Successfully invalidated Verida profile queries")
}
