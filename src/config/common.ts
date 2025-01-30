import { CommonConfigSchema } from "@/config/schemas"
import { version } from "@/config/version"

const commonConfigCheckResult = CommonConfigSchema.safeParse({
  // Have to pass the variables one-by-one on the client because they are set
  // and replaced at build time only if they are explicitly used somewhere in
  // the code(like here). It also allows us to have shorter names.
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE,
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
  VERIDA_APP_DID: process.env.NEXT_PUBLIC_VERIDA_APP_DID,
  VERIDA_AUTH_URL: process.env.NEXT_PUBLIC_VERIDA_AUTH_URL,
  isClient: !(typeof window === "undefined"),
  appVersion: version,
})

if (!commonConfigCheckResult.success) {
  // eslint-disable-next-line no-console
  console.warn("Common config errors")
  commonConfigCheckResult.error.errors.forEach((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
  })

  throw new Error("Common config errors")
}

/**
 * Common config available on both the client and the server.
 *
 * All component and piece of code expecting to run on the client should use this config.
 */
export const commonConfig = commonConfigCheckResult.data
