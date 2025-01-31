import { z } from "zod"

import { Logger } from "@/features/telemetry/logger"

/**
 * Creates a Zod schema for an array that filters out invalid items based on the provided schema.
 * Invalid items are logged as errors if a logger is provided.
 *
 * @param schema - The Zod schema to validate each array item against
 * @param logger - Optional Logger instance to log validation errors
 * @returns A transformed Zod array schema that only includes valid items
 *
 * @example
 * ```ts
 * const ItemSchema = z.object({ id: z.string() })
 * const ValidArraySchema = filteredArraySchema(ItemSchema, logger)
 *
 * // Will filter out invalid items and only return valid ones
 * const result = ValidArraySchema.parse([
 *   { id: "1" },      // Valid - included
 *   { id: 123 },      // Invalid - filtered out
 *   { id: "2" }       // Valid - included
 * ])
 * ```
 */
export function filteredArraySchema<S extends z.ZodSchema>(
  schema: S,
  logger?: Logger
) {
  return z.array(z.unknown()).transform((items) => {
    return items
      .map((item) => schema.safeParse(item))
      .filter((item): item is z.infer<S> => {
        if (!item.success) {
          logger?.error(item.error)
        }
        return item.success
      })
      .map((item) => item.data)
  })
}
