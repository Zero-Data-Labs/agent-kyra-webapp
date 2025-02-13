import type { z } from "zod"

import type { VeridaAuthTokenDetailsSchema } from "@/features/verida-auth/schemas"

export interface VeridaAuthTokenDetails
  extends z.infer<typeof VeridaAuthTokenDetailsSchema> {
  token: string
}

export type VeridaAuthStatus = "authenticated" | "unauthenticated" | "loading"

export interface VeridaAuthContextValue {
  authDetails: VeridaAuthTokenDetails | null
  status: VeridaAuthStatus
  setToken: (token: string) => void
  disconnect: () => void
}

export type VeridaAuthRequestPayer = "app" | "user"

export type VeridaAuthRequest = {
  appDid: string
  payer: VeridaAuthRequestPayer
  scopes: string[]
  redirectUrl: string
  state?: Record<string, unknown>
}

export type VeridaAuthResponseError =
  | "access_denied"
  | "invalid_request"
  | "server_error"
  | "unknown"

export interface VeridaAuthErrorInfo {
  title: string
  description: string
}

export type VeridaAuthResponse =
  | {
      status: "success"
      token: string
    }
  | {
      status: "error"
      error: VeridaAuthResponseError
      errorDescription: string | null
    }
  | {
      status: "idle"
    }
