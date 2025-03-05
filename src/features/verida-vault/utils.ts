import { commonConfig } from "@/config/common"

export function getDataConnectionPageUrl(connectionId: string) {
  const url = new URL(
    `/connections/${connectionId}`,
    commonConfig.VERIDA_VAULT_BASE_URL
  )

  return url
}
