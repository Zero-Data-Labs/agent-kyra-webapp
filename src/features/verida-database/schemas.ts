import { z } from "zod"

import { Logger } from "@/features/telemetry/logger"
import { filteredArraySchema } from "@/utils/schemas"

const logger = Logger.create("verida-database")

export const VeridaBaseRecordSchema = z.object({
  _id: z.string(),
  _rev: z.string().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
  icon: z.string().optional(),
  schema: z.string().optional(),
  insertedAt: z.string().optional(),
  modifiedAt: z.string().optional(),
  signatures: z.record(z.any()).optional(),
})

export const VeridaBaseUnsavedRecordSchema = VeridaBaseRecordSchema.partial()

/**
 * Creates a Zod schema for validating Verida database query API responses.
 *
 * @param baseSchema - Optional Zod object schema that will extend the base Verida record schema.
 * @returns A Zod schema for validating the API response
 *
 * @example
 * ```ts
 * const CustomSchema = z.object({
 *   customField: z.string()
 * })
 * const responseSchema = getVeridaDatabaseQueryApiV1ResponseSchema(CustomSchema)
 * ```
 */
export function getVeridaDatabaseQueryApiV1ResponseSchema<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends z.ZodObject<any>,
>(baseSchema?: T) {
  const itemSchema = baseSchema
    ? VeridaBaseRecordSchema.extend(baseSchema.shape)
    : VeridaBaseRecordSchema.passthrough()

  return z.object({
    items: filteredArraySchema(itemSchema, logger),
    limit: z.number().optional(),
    skip: z.number().optional(),
    dbRows: z.number().optional(),
  })
}

/**
 * Creates a Zod schema for validating Verida get record API responses.
 *
 * @param baseSchema - Optional Zod object schema that will extend the base Verida record schema.
 * @returns A Zod schema for validating the API response
 *
 * @example
 * ```ts
 * const CustomSchema = z.object({
 *   customField: z.string()
 * })
 * const responseSchema = getVeridaDatabaseGetRecordApiV1ResponseSchema(CustomSchema)
 * ```
 */
export function getVeridaDatabaseGetRecordApiV1ResponseSchema<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends z.ZodObject<any>,
>(baseSchema?: T) {
  const itemSchema = baseSchema
    ? VeridaBaseRecordSchema.extend(baseSchema.shape)
    : VeridaBaseRecordSchema.passthrough()

  return z.object({
    item: itemSchema,
  })
}

export const VeridaDatabaseDeleteApiV1ResponseSchema = z.object({
  success: z.boolean(),
})

/**
 * Creates a Zod schema for validating Verida record creation API responses.
 *
 * @param baseSchema - Optional Zod object schema that will extend the base Verida record schema. No need to pass a VeridaRecord schema already, simply the specific fields of the record.
 * @returns A Zod schema for validating the API response
 *
 * @example
 * ```ts
 * const CustomSchema = z.object({
 *   customField: z.string()
 * })
 * const responseSchema = getCreateVeridaRecordApiV1ResponseSchema(CustomSchema)
 * ```
 */
export function getCreateVeridaRecordApiV1ResponseSchema<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends z.ZodObject<any>,
>(baseSchema?: T) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      record: baseSchema
        ? VeridaBaseRecordSchema.extend(baseSchema.shape)
        : VeridaBaseRecordSchema.passthrough(),
    }),
    z.object({
      success: z.literal(false),
      errors: z.any(), // TODO: Define better type, unsure what it is
    }),
  ])
}

/**
 * Creates a Zod schema for validating Verida record update API responses.
 *
 * @param baseSchema - Optional Zod object schema that will extend the base Verida record schema. No need to pass a VeridaRecord schema already, simply the specific fields of the record.
 * @returns A Zod schema for validating the API response
 *
 * @example
 * ```ts
 * const CustomSchema = z.object({
 *   customField: z.string()
 * })
 * const responseSchema = getUpdateVeridaRecordApiV1ResponseSchema(CustomSchema)
 * ```
 */
export function getUpdateVeridaRecordApiV1ResponseSchema<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends z.ZodObject<any>,
>(baseSchema?: T) {
  return z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      record: baseSchema
        ? VeridaBaseRecordSchema.extend(baseSchema.shape)
        : VeridaBaseRecordSchema.passthrough(),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().optional(),
      errors: z.any().optional(), // TODO: Define better type, unsure what it is
    }),
  ])
}
