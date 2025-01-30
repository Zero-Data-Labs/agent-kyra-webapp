import { commonConfig } from "@/config/common"
import { getAuthPageRoute } from "@/features/routes/utils"
import { VERIDA_AUTH_REQUIRED_SCOPES } from "@/features/verida-auth/constants"
import type { VeridaAuthRequest } from "@/features/verida-auth/type"

/**
 * Builds a URL for the Verida authentication request
 *
 * @param request - The VeridaAuthRequest object containing authentication parameters
 * @returns A fully formed URL string for the Verida auth endpoint with query parameters
 *
 * The URL will include:
 * - appDID: The application's DID identifier
 * - scopes: One or more permission scopes required by the app
 * - redirectUrl: Where to redirect after auth completion
 * - state: Optional state data to pass through the auth flow (will be JSON stringified)
 */
export function buildVeridaAuthRequestUrl(request: VeridaAuthRequest): string {
  const url = new URL(commonConfig.VERIDA_AUTH_URL)

  url.searchParams.set("appDID", request.appDid)
  for (const scope of request.scopes) {
    url.searchParams.append("scopes", scope)
  }
  url.searchParams.set("redirectUrl", request.redirectUrl)
  if (request.state) {
    url.searchParams.set("state", JSON.stringify(request.state))
  }

  return url.toString()
}

/**
 * Builds a Verida authentication request object
 *
 * @param appBaseUrl - The base URL of this application (e.g. http://localhost:3003)
 * @returns A VeridaAuthRequest object containing:
 *  - appDid: The DID (Decentralized Identifier) of this application
 *  - scopes: Array of required permission scopes for the application
 *  - redirectUrl: URL where the user will be redirected after authentication
 */
export function buildVeridaAuthRequest(appBaseUrl: string): VeridaAuthRequest {
  return {
    appDid: commonConfig.VERIDA_APP_DID,
    scopes: VERIDA_AUTH_REQUIRED_SCOPES,
    redirectUrl: getAuthPageRoute(appBaseUrl),
  }
}
