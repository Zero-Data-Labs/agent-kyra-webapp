export type VeridaAuthStatus = "authenticated" | "unauthenticated" | "loading"

export interface VeridaAuthContextValue {
  token: string | null
  status: VeridaAuthStatus
  setToken: (token: string | null) => void
  disconnect: () => void
}

export type VeridaAuthRequest = {
  appDid: string
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
