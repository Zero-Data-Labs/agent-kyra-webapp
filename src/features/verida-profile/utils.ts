import { Logger } from "@/features/telemetry/logger"
import { VERIDA_PROFILE_DB_NAME } from "@/features/verida-profile/constants"
import { VeridaProfileApiResponseSchema } from "@/features/verida-profile/schemas"
import type { VeridaProfile } from "@/features/verida-profile/types"
import {
  VERIDA_NETWORK,
  VERIDA_VAULT_CONTEXT_NAME,
} from "@/features/verida/constants"
import { isValidVeridaDid } from "@/features/verida/utils"

const logger = Logger.create("verida-profile")

type FetchVeridaProfileArgs = {
  did: string
  options?: {
    ignoreCache?: boolean
  }
}

/**
 * Fetches a Verida profile.
 *
 * @param args - The arguments for fetching the profile.
 * @returns The fetched Verida profile.
 * @throws If the DID is invalid or if fetching fails.
 */
export async function fetchVeridaProfile({
  did,
  options,
}: FetchVeridaProfileArgs): Promise<VeridaProfile> {
  if (!isValidVeridaDid(did)) {
    throw new Error("Invalid Verida DID")
  }

  try {
    logger.info("Fetching Verida profile from API")

    const url = new URL(
      // TODO: Extract the base URL in an env variable
      `https://data.verida.network/${did}/${VERIDA_NETWORK}/${VERIDA_VAULT_CONTEXT_NAME}/profile_public/${VERIDA_PROFILE_DB_NAME}`
    )
    if (options?.ignoreCache) {
      url.searchParams.set("ignoreCache", "true")
    }

    const response = await fetch(url)

    const data = await response.json()

    const validatedProfile = VeridaProfileApiResponseSchema.parse(data)
    logger.info("Successfully fetched and validated Verida profile from API")

    return validatedProfile
  } catch (error) {
    throw new Error("Failed to fetch Verida profile", { cause: error })
  }
}
