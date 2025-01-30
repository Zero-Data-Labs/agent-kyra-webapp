"use client"

import { parseAsString, useQueryState } from "nuqs"
import { useMemo } from "react"

import { type VeridaAuthResponse } from "@/features/verida-auth/type"
import { isVeridaAuthError } from "@/features/verida-auth/utils"

export function useVeridaAuthResponse(): VeridaAuthResponse {
  const [authToken] = useQueryState("auth_token", parseAsString)
  const [error] = useQueryState("error", parseAsString)
  const [errorDescription] = useQueryState("error_description", parseAsString)

  const response: VeridaAuthResponse = useMemo(() => {
    if (authToken) {
      return {
        status: "success",
        token: authToken,
      }
    }

    if (error) {
      return {
        status: "error",
        error: isVeridaAuthError(error) ? error : "unknown",
        errorDescription: errorDescription,
      }
    }
    return {
      status: "idle",
    }
  }, [authToken, error, errorDescription])

  return response
}
