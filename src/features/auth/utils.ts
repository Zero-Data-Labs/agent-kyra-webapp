import { commonConfig } from "@/config/common"
import {
  buildVeridaAuthRequest,
  buildVeridaAuthRequestUrl,
} from "@/features/verida-auth/utils"

/**
 * Builds a Verida authentication URL for user login
 *
 * @returns The complete Verida authentication URL
 */
export function buildAuthUrl() {
  const request = buildVeridaAuthRequest(commonConfig.BASE_URL)
  return buildVeridaAuthRequestUrl(request)
}
