import { createSerializer, parseAsString, useQueryState } from "nuqs"

import { getDefaultRedirectPathAfterAuthentication } from "@/features/routes/utils"

const DEFAULT_REDIRECT_PATH = getDefaultRedirectPathAfterAuthentication()

export function useAuthRedirectPathState() {
  const [redirectPath, setRedirectPath] = useQueryState(
    "redirectPath",
    parseAsString
  )

  const serializeRedirectPath = createSerializer({
    redirectPath: parseAsString,
  })

  return {
    redirectPath: redirectPath || DEFAULT_REDIRECT_PATH,
    setRedirectPath,
    serializeRedirectPath,
  }
}
