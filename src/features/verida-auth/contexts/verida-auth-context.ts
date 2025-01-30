import { createContext } from "react"

import type { VeridaAuthContextValue } from "@/features/verida-auth/type"

export const VeridaAuthContext = createContext<VeridaAuthContextValue | null>(
  null
)
