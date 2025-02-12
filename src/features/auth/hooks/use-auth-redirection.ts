import { redirect } from "next/navigation"
import { useCallback } from "react"

import { getRootPageRoute } from "@/features/routes/utils"

export function useAuthRedirection() {
  // const { serializeRedirectPath } = useAuthRedirectPathState()

  // const pathName = usePathname()
  // const searchParams = useSearchParams()

  // const targetUrl = useMemo(
  //   () =>
  //     `${pathName}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
  //   [pathName, searchParams]
  // )

  const redirectToAuthPage = useCallback(() => {
    redirect(getRootPageRoute())

    // TODO: Re-enable the redirectPath but handle the disconnect case which doesn't need the redirectPath
    // redirect(
    //   serializeRedirectPath(getRootPageRoute(), {
    //     redirectPath: targetUrl,
    //   })
    // )
  }, [])

  return {
    redirectToAuthPage,
  }
}
