import { useContext } from "react"

import { VeridaAuthContext } from "@/features/verida-auth/contexts/verida-auth-context"

export function useVeridaAuth() {
  const contextValue = useContext(VeridaAuthContext)
  if (!contextValue) {
    throw new Error("useVeridaAuth must be used within an VeridaAuthProvider")
  }
  return contextValue
}
