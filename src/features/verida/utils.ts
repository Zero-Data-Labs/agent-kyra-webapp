import { VERIDA_DID_REGEXP } from "@/features/verida/constants"

export function isValidVeridaDid(maybeDid: string) {
  return VERIDA_DID_REGEXP.test(maybeDid)
}
