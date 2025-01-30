import type {
  VeridaAuthErrorInfo,
  VeridaAuthResponseError,
} from "@/features/verida-auth/type"

export const AUTH_TOKEN_LOCAL_STORAGE_KEY = "kyra_verida_auth_token"

export const VERIDA_AUTH_REQUIRED_SCOPES: string[] = [
  "api:llm-agent-prompt",
  "api:ds-query",
  "api:db-query",
  "api:ds-get-by-id",
  "api:db-get-by-id",
  "api:ds-create",
  "api:ds-update",
  "api:ds-delete",
]

export const VERIDA_AUTH_ERROR_MESSAGES: Record<
  VeridaAuthResponseError,
  VeridaAuthErrorInfo
> = {
  access_denied: {
    title: "Access Denied",
    description: "You have denied access to your Verida account.",
  },
  invalid_request: {
    title: "Invalid Request",
    description: "The authentication request was invalid. Please try again.",
  },
  server_error: {
    title: "Server Error",
    description:
      "An error occurred on the authentication server. Please try again later.",
  },
  unknown: {
    title: "Unknown Error",
    description: "An unexpected error occurred during authentication.",
  },
}
