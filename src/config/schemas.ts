import { z } from "zod"

export const CommonConfigSchema = z.object({
  BASE_URL: z.string().url(),
  DEV_MODE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  SENTRY_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  VERIDA_APP_DID: z.string(),
  VERIDA_AUTH_URL: z.string().url(),
  isClient: z.boolean(),
  appVersion: z.string(),
})

export const ServerConfigSchema = z.object({
  // ... any server-specific properties
})
