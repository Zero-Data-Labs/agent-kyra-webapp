import { redirect, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

import { useAuthRedirectPathState } from "@/features/auth/hooks/use-auth-redirect-path-state"
import { getRootPageRoute } from "@/features/routes/utils"

export function useAuthRedirection() {
  const { serializeRedirectPath } = useAuthRedirectPathState()

  const pathName = usePathname()
  const searchParams = useSearchParams()

  const targetUrl = useMemo(
    () =>
      `${pathName}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    [pathName, searchParams]
  )

  const redirectToAuthPage = useCallback(() => {
    redirect(
      serializeRedirectPath(getRootPageRoute(), {
        redirectPath: targetUrl,
      })
    )
  }, [targetUrl, serializeRedirectPath])

  return {
    redirectToAuthPage,
  }
}
