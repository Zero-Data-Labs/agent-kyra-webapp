import { commonConfig } from "@/config/common"
import { getAuthPageRoute } from "@/features/routes/utils"
import { Logger } from "@/features/telemetry/logger"
import {
  VERIDA_AUTH_ERROR_MESSAGES,
  VERIDA_AUTH_REQUIRED_SCOPES,
} from "@/features/verida-auth/constants"
import { GetVeridaAuthTokenDetailsApiV1ResponseSchema } from "@/features/verida-auth/schemas"
import type {
  VeridaAuthRequest,
  VeridaAuthResponseError,
  VeridaAuthTokenDetails,
} from "@/features/verida-auth/type"

const logger = Logger.create("verida-auth")

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
  if (request.payer) {
    url.searchParams.set("payer", request.payer)
  }
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
    payer: "app",
    scopes: VERIDA_AUTH_REQUIRED_SCOPES,
    redirectUrl: getAuthPageRoute(appBaseUrl),
  }
}

/**
 * Type guard to check if a string value is a valid Verida authentication error
 *
 * @param value - The string value to check
 * @returns True if the value is a valid Verida auth error code, false otherwise
 */
export function isVeridaAuthError(
  value: string
): value is VeridaAuthResponseError {
  return value in VERIDA_AUTH_ERROR_MESSAGES
}

/**
 * Fetches and validates the details of a Verida authentication token
 *
 * @param token - The Verida authentication token to get details for.
 * @returns A promise that resolves to a VeridaAuthTokenDetails object.
 * @throws Error if the API request fails or returns invalid data
 */
export async function getVeridaAuthTokenDetails(
  token: string
): Promise<VeridaAuthTokenDetails> {
  logger.info("Getting Verida auth token details")

  try {
    const url = new URL(
      "/api/rest/v1/auth/token",
      commonConfig.VERIDA_DATA_API_BASE_URL
    )
    url.searchParams.set("tokenId", token)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    const validatedData =
      GetVeridaAuthTokenDetailsApiV1ResponseSchema.parse(data)

    logger.info("Successfully got Verida auth token details")

    const tokenDetails: VeridaAuthTokenDetails = {
      ...validatedData.token,
      token,
    }

    return tokenDetails
  } catch (error) {
    throw new Error("Error getting Verida auth token details", {
      cause: error,
    })
  }
}
