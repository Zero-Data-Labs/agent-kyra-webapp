import { useMemo } from "react"

import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { useVeridaProfile } from "@/features/verida-profile/hooks/use-verida-profile"

export function useUserProfile() {
  const { authDetails } = useVeridaAuth()

  const { profile, ...query } = useVeridaProfile({ did: authDetails?.did })

  const resolvedProfile = useMemo(() => {
    return authDetails?.did ? profile : null
  }, [authDetails?.did, profile])

  return {
    did: authDetails?.did ?? null,
    profile: resolvedProfile ?? null,
    ...query,
  }
}
