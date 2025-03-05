import { z } from "zod"

import {
  DataConnectionConfigOptionSchema,
  DataConnectionHandlerSchema,
  DataConnectionHandlerStatusSchema,
  DataConnectionSchema,
  DataConnectionStatusSchema,
  DataProviderHandlerSchema,
  DataProviderSchema,
  DataProviderStatusSchema,
} from "@/features/data-connections/schemas"

// Data Connections and Providers definitions

export type DataProviderStatus = z.infer<typeof DataProviderStatusSchema>

export type DataProvider = z.infer<typeof DataProviderSchema>

export type DataProviderHandler = z.infer<typeof DataProviderHandlerSchema>

export type DataConnectionConfigOption = z.infer<
  typeof DataConnectionConfigOptionSchema
>

// Data Connections instances

export type DataConnection = z.infer<typeof DataConnectionSchema>

export type DataConnectionStatus = z.infer<typeof DataConnectionStatusSchema>

export type DataConnectionHandler = z.infer<typeof DataConnectionHandlerSchema>

export type DataConnectionHandlerStatus = z.infer<
  typeof DataConnectionHandlerStatusSchema
>
