import { AI_ASSISTANTS_DB_DEF } from "@/features/agents/constants"
import { AI_PROMPTS_DB_DEF } from "@/features/prompts/constants"
import type {
  VeridaAuthErrorInfo,
  VeridaAuthResponseError,
} from "@/features/verida-auth/type"

export const AUTH_TOKEN_LOCAL_STORAGE_KEY = "kyra_verida_auth_token"

export const VERIDA_AUTH_REQUIRED_SCOPES: string[] = [
  // Main permission for the LLM endpoint
  "api:llm-agent-prompt",

  // For managing user agents and saved prompts
  "api:ds-query",
  "api:db-query",
  "api:ds-get-by-id",
  "api:db-get-by-id",
  "api:ds-create",
  "api:ds-update",
  "api:ds-delete",
  "db:r:ai_assistant",
  "db:r:ai_prompt",
  `ds:rwd:${AI_ASSISTANTS_DB_DEF.schemaUrlLatest}`,
  `ds:rwd:${AI_PROMPTS_DB_DEF.schemaUrlLatest}`,

  // For data access by the LLM endpoint
  "ds:r:social-email",
  "ds:r:social-following",
  "ds:r:social-post",
  "ds:r:favourite",
  "ds:r:file",
  "ds:r:social-chat-group",
  "ds:r:social-chat-message",
  "ds:r:social-calendar",
  "ds:r:social-event",
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
