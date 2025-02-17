import { useQuery } from "@tanstack/react-query"

import { getVeridaAuthTokenDetails } from "@/features/verida-auth/utils"

export function useGetVeridaAuthTokenDetails(token: string | null) {
  const { data, ...query } = useQuery({
    enabled: !!token,
    queryKey: ["verida-auth-token-details", token],
    queryFn: () => {
      if (!token) {
        // Would not happen as the query is disabled if token is null
        throw new Error("Token is required")
      }

      return getVeridaAuthTokenDetails(token)
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity, // Never garbage collect
    meta: {
      logCategory: "verida-auth",
      errorMessage: "Error getting Verida Auth token details",
    },
  })

  return {
    authTokenDetails: data,
    ...query,
  }
}
