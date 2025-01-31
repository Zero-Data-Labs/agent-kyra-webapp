import { z } from "zod"

import { commonConfig } from "@/config/common"
import { Logger } from "@/features/telemetry/logger"
import {
  VeridaDatabaseDeleteApiV1ResponseSchema,
  getCreateVeridaRecordApiV1ResponseSchema,
  getUpdateVeridaRecordApiV1ResponseSchema,
  getVeridaDatabaseGetRecordApiV1ResponseSchema,
  getVeridaDatabaseQueryApiV1ResponseSchema,
} from "@/features/verida-database/schemas"
import type {
  DatabaseDefinition,
  FetchVeridaRecordsResult,
  UnsavedVeridaRecord,
  VeridaDatabaseQueryFilter,
  VeridaDatabaseQueryOptions,
  VeridaRecord,
} from "@/features/verida-database/types"

const logger = Logger.create("verida-database")

const defaultVeridaDatabaseQueryOptions: VeridaDatabaseQueryOptions = {
  skip: 0,
  limit: 10,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetVeridaRecordsArgs<T extends z.ZodObject<any>> = {
  authToken: string
  databaseDefinition: DatabaseDefinition
  filter?: VeridaDatabaseQueryFilter<VeridaRecord<z.infer<T>>>
  options?: VeridaDatabaseQueryOptions<VeridaRecord<z.infer<T>>>
  baseSchema?: T
}

/**
 * Gets Verida records from the specified database.
 *
 * @param params - Function parameters
 * @param params.authToken - The session token for authentication
 * @param params.databaseDefinition - The database to query
 * @param params.filter - Optional query filter to apply to the records
 * @param params.options - Optional query parameters (sort, limit, skip)
 * @param params.baseSchema - Optional base schema to extend the records with
 * @returns Promise resolving to an array of VeridaRecord objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVeridaRecords<T extends z.ZodObject<any>>({
  authToken,
  databaseDefinition,
  filter,
  options,
  baseSchema,
}: GetVeridaRecordsArgs<T>): Promise<FetchVeridaRecordsResult<z.infer<T>>> {
  logger.info("Getting Verida records", {
    database: databaseDefinition.databaseVaultName,
  })

  const resolvedOptions = {
    // A simple merge is enough as the default options are not in nested objects
    ...defaultVeridaDatabaseQueryOptions,
    ...options,
  }

  try {
    const url = new URL(
      `/api/rest/v1/db/query/${databaseDefinition.databaseVaultName}`,
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({ query: filter, options: resolvedOptions }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const data = await response.json()

    const valdationSchema =
      getVeridaDatabaseQueryApiV1ResponseSchema(baseSchema)

    const validatedData = valdationSchema.parse(data)

    logger.info("Successfully got Verida records", {
      database: databaseDefinition.databaseVaultName,
    })

    return {
      records: validatedData.items as VeridaRecord<z.infer<T>>[],
      pagination: {
        limit: validatedData.limit ?? null,
        skipped: validatedData.skip ?? null,
        unfilteredTotalRecordsCount: validatedData.dbRows ?? null,
      },
    }
  } catch (error) {
    throw new Error("Error getting Verida records", { cause: error })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetVeridaRecordArgs<T extends z.ZodObject<any>> = {
  authToken: string
  databaseDefinition: DatabaseDefinition
  recordId: string
  baseSchema?: T
}

/**
 * Gets a single Verida data record from the specified database.
 *
 * @param key - API key for authentication
 * @param databaseDefinition - The database to query
 * @param recordId - The ID of the record to fetch
 * @param baseSchema - Optional base schema to extend the record with
 * @returns Promise resolving to a single VeridaRecord object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVeridaRecord<T extends z.ZodObject<any>>({
  authToken,
  databaseDefinition,
  recordId,
  baseSchema,
}: GetVeridaRecordArgs<T>): Promise<VeridaRecord<z.infer<T>>> {
  logger.info("Getting a single Verida record", {
    database: databaseDefinition.databaseVaultName,
  })

  try {
    const url = new URL(
      `/api/rest/v1/db/get/${databaseDefinition.databaseVaultName}/${recordId}`,
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const data = await response.json()

    const validationSchema =
      getVeridaDatabaseGetRecordApiV1ResponseSchema(baseSchema)

    const validatedData = validationSchema.parse(data)

    logger.info("Successfully got a Verida record", {
      database: databaseDefinition.databaseVaultName,
      recordId,
    })

    return validatedData.item as VeridaRecord<z.infer<T>>
  } catch (error) {
    throw new Error("Error getting a Verida record", {
      cause: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateVeridaRecordArgs<T extends z.ZodObject<any>> = {
  authToken: string
  databaseDefinition: DatabaseDefinition
  record: UnsavedVeridaRecord<z.infer<T>>
  baseSchema?: T
}

/**
 * Creates a new Verida data record in the specified database.
 *
 * @template T - The type of the record being created.
 * @param params - The parameters for creating the record.
 * @param params.authToken - The session token for authentication.
 * @param params.databaseDefinition - The database to create the record in.
 * @param params.record - The record data to be created.
 * @returns A promise that resolves to the created Verida record.
 * @throws If the API configuration is incorrect or if the creation operation fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createVeridaRecord<T extends z.ZodObject<any>>({
  authToken,
  databaseDefinition,
  record,
  baseSchema,
}: CreateVeridaRecordArgs<T>): Promise<VeridaRecord<z.infer<T>>> {
  logger.info("Creating a Verida record", {
    database: databaseDefinition.databaseVaultName,
  })

  try {
    const schemaUrlBase64 = getEncodedSchemaUrlFromDatabase(databaseDefinition)

    const url = new URL(
      `/api/rest/v1/ds/${schemaUrlBase64}`,
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        record,
        // Note: `options` parameter is available if needed in the future
      }),
    })

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    // Parse and validate the response data
    const validationSchema =
      getCreateVeridaRecordApiV1ResponseSchema(baseSchema)

    const data = await response.json()
    const validatedData = validationSchema.parse(data)

    // Check if the operation was successful
    if (!validatedData.success) {
      throw new Error("API returned unsuccessful operation")
    }

    logger.info("Successfully created a Verida record", {
      database: databaseDefinition.databaseVaultName,
    })

    // Return the created record
    // HACK: Had to assert the result because typescript doesn't recognise the
    // _id, probably because "_" is considered a private property
    return validatedData.record as VeridaRecord<z.infer<T>>
  } catch (error) {
    throw new Error("Error creating Verida data record", { cause: error })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateVeridaRecordArgs<T extends z.ZodObject<any>> = {
  authToken: string
  databaseDefinition: DatabaseDefinition
  record: VeridaRecord<z.infer<T>>
  baseSchema?: T
}

/**
 * Updates a Verida record in the specified database.
 *
 * This function sends a PUT request to the Verida API to update an existing record.
 * It handles the API communication, error checking, and response validation.
 *
 * @param params - The parameters for updating the record
 * @param params.authToken - The session token for authentication
 * @param params.databaseDefinition - The database containing the record
 * @param params.record - The record to be updated, including its _id
 * @returns A promise that resolves to the updated record
 * @throws If the API configuration is incorrect, the API request fails, or the operation is unsuccessful
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateVeridaRecord<T extends z.ZodObject<any>>({
  authToken,
  databaseDefinition,
  record,
  baseSchema,
}: UpdateVeridaRecordArgs<T>): Promise<VeridaRecord<z.infer<T>>> {
  logger.info("Updating a Verida record", {
    database: databaseDefinition.databaseVaultName,
  })

  try {
    const schemaUrlBase64 = getEncodedSchemaUrlFromDatabase(databaseDefinition)

    const url = new URL(
      `/api/rest/v1/ds/${schemaUrlBase64}/${record._id}`,
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        record,
        // Note: `options` parameter is available if needed in the future
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const validationSchema =
      getUpdateVeridaRecordApiV1ResponseSchema(baseSchema)

    const data = await response.json()
    const validatedData = validationSchema.parse(data)

    // Check if the operation was successful
    if (!validatedData.success) {
      throw new Error("API returned unsuccessful operation")
    }

    logger.info("Successfully updated a Verida record", {
      database: databaseDefinition.databaseVaultName,
    })

    // Return the updated record
    // HACK: Had to assert the result because typescript doesn't recognise the
    // _id, probably because "_" is considered a private property
    return validatedData.record as VeridaRecord<z.infer<T>>
  } catch (error) {
    throw new Error("Error updating Verida data record", { cause: error })
  }
}

type DeleteVeridaRecordArgs = {
  authToken: string
  databaseDefinition: DatabaseDefinition
  recordId: string
}

/**
 * Deletes a single Verida data record from the specified database.
 *
 * @param params - The parameters for deleting the record.
 * @param params.authToken - The session token for authentication.
 * @param params.databaseDefinition - The database containing the record.
 * @param params.recordId - The ID of the record to delete.
 */
export async function deleteVeridaRecord({
  authToken,
  databaseDefinition,
  recordId,
}: DeleteVeridaRecordArgs) {
  logger.info(`Deleting a Verida record`, {
    database: databaseDefinition.databaseVaultName,
  })

  try {
    const schemaUrlBase64 = getEncodedSchemaUrlFromDatabase(databaseDefinition)

    const url = new URL(
      `/api/rest/v1/ds/${schemaUrlBase64}/${recordId}`,
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const data = await response.json()
    const validatedData = VeridaDatabaseDeleteApiV1ResponseSchema.parse(data)

    if (!validatedData.success) {
      throw new Error("API returned unsuccessful operation")
    }

    logger.info(`Successfully deleted a Verida record`, {
      database: databaseDefinition.databaseVaultName,
    })
  } catch (error) {
    throw new Error(`Error deleting Verida record`, { cause: error })
  }
}

/**
 * Encodes a database schema URL to base64 format.
 *
 * @param databaseDefinition - The database definition containing the schema URL
 * @returns The base64 encoded schema URL string
 */
export function getEncodedSchemaUrlFromDatabase(
  databaseDefinition: DatabaseDefinition
) {
  return Buffer.from(databaseDefinition.schemaUrlLatest, "utf8").toString(
    "base64"
  )
}
