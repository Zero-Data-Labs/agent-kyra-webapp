import { z } from "zod"

import { Logger } from "@/features/telemetry/logger"
import { filteredArraySchema } from "@/utils/schemas"

const logger = Logger.create("data-connections")

// TODO: Finalise the schema
export const DataConnectionConfigOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(), // TODO: Set up enum of types
  // TODO: Add options for different types
  defaultValue: z.string().optional(),
})

export const DataProviderHandlerSchema = z.object({
  id: z.string(),
  label: z.string(),
  options: z.array(DataConnectionConfigOptionSchema).optional(),
})

export const DataProviderStatusSchema = z
  .enum(["active", "upcoming", "inactive"])
  .default("inactive")

export const DataProviderSchema = z.object({
  id: z.string(),
  status: DataProviderStatusSchema,
  label: z.string(),
  icon: z.string().url(),
  description: z.string().optional(),
  options: z.array(DataConnectionConfigOptionSchema).optional(),
  handlers: z.array(DataProviderHandlerSchema).optional(),
})

export const DataConnectionsApiV1GetProvidersResponseSchema = z.object({
  success: z.boolean(),
  items: filteredArraySchema(DataProviderSchema, logger),
})

export const DataConnectionStatusSchema = z.enum([
  "connected",
  "error",
  "invalid-auth",
  "paused",
  "active",
])

export const DataConnectionHandlerStatusSchema = z.enum([
  "enabled",
  "disabled",
  "error",
  "invalid-auth",
  "syncing",
])

export const DataConnectionHandlerSchema = z.object({
  handlerId: z.string(),
  enabled: z.boolean(),
  status: DataConnectionHandlerStatusSchema,
  syncMessage: z.string().optional(),
  latestSyncStart: z.string().optional(),
  latestSyncEnd: z.string().optional(),
  oldestDataTimestamp: z.string().optional(),
  newestDataTimestamp: z.string().optional(),
})

export const DataConnectionSchema = z.object({
  _id: z.string(),
  providerId: z.string(),
  accountId: z.string(),
  readableId: z.string(),
  syncStatus: DataConnectionStatusSchema,
  syncFrequency: z.string(),
  syncStart: z.string().optional(),
  syncEnd: z.string().optional(),
  syncNext: z.string().optional(),
  syncMessage: z.string().optional(),
  handlers: z.array(DataConnectionHandlerSchema),
})

export const DataConnectionsApiV1GetConnectionsResponseSchema = z.object({
  items: z.array(DataConnectionSchema),
  success: z.boolean(),
})
