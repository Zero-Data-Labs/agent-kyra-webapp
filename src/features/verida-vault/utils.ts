import { commonConfig } from "@/config/common"

export function getVeridaVaultDataConnectionPageUrl(connectionId: string) {
  const url = new URL(
    `/connections/${connectionId}`,
    commonConfig.VERIDA_VAULT_BASE_URL
  )

  return url
}

export function getVeridaVaultDataConnectionsPageURL() {
  return new URL("/connections", commonConfig.VERIDA_VAULT_BASE_URL)
}
