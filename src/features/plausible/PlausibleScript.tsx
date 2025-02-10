import NextPlausibleProvider from "next-plausible"
import React from "react"

import { commonConfig } from "@/config/common"

export function PlausibleScript() {
  if (!commonConfig.PLAUSIBLE_DOMAIN) {
    return null
  }

  return <NextPlausibleProvider domain={commonConfig.PLAUSIBLE_DOMAIN} />
}
PlausibleScript.displayName = "PlausibleScript"
