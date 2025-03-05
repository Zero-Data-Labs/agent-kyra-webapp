import { isDate } from "date-fns"

import { commonConfig } from "@/config/common"
import { DEFAULT_DATA_PROVIDER_DESCRIPTION } from "@/features/data-connections/constants"
import {
  DataConnectionsApiV1GetConnectionsResponseSchema,
  DataConnectionsApiV1GetProvidersResponseSchema,
} from "@/features/data-connections/schemas"
import type {
  DataConnection,
  DataProvider,
} from "@/features/data-connections/types"
import { Logger } from "@/features/telemetry/logger"

const logger = Logger.create("data-connections")

/**
 * Fetches data providers from the API or returns mock data if the API is not configured.
 *
 * @returns A promise that resolves to an array of DataProvider objects
 * @throws Error if there's an issue fetching the data providers
 */
export async function getDataProviders(): Promise<DataProvider[]> {
  logger.info("Fetching data providers")

  try {
    logger.debug("Sending API request to fetch data providers")

    const url = new URL(
      "/api/rest/v1/providers",
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const data = await response.json()
    logger.debug("Received response from providers API")

    // Validate the API response against the expected schema
    const validatedData =
      DataConnectionsApiV1GetProvidersResponseSchema.parse(data)

    if (!validatedData.success) {
      throw new Error("API returned unsuccessful operation")
    }

    logger.info("Successfully fetched data providers")

    // Map the validated data to DataProvider objects, ensuring each has a description
    const providers: DataProvider[] = validatedData.items.map((provider) => ({
      ...provider,
      description: provider.description || DEFAULT_DATA_PROVIDER_DESCRIPTION,
    }))

    // Sort the providers by label
    return providers
      .filter((provider) => provider.id !== "mock")
      .filter(
        (provider) =>
          // For now, explicitly accepting active and upcoming providers
          // But we'll need to update in case of additional statuses
          provider.status === "active" || provider.status === "upcoming"
      )
      .sort((a, b) => {
        // Sort by status first (active before upcoming)
        if (a.status !== b.status) {
          return a.status === "active" ? -1 : 1
        }
        // Then sort by label
        return a.label.localeCompare(b.label)
      })
  } catch (error) {
    throw new Error("Error fetching data providers", { cause: error })
  }
}

/**
 * Fetches data connections from the API or returns mock data if the API is not configured.
 *
 * @param authToken - The authentication token for authentication
 * @returns A promise that resolves to an array of DataConnection
 * @throws Error if there's an issue fetching the data connections
 */
export async function getDataConnections(
  authToken: string
): Promise<DataConnection[]> {
  logger.info("Fetching data connections")

  try {
    logger.debug("Sending API request to fetch data connections")

    const url = new URL(
      "/api/rest/v1/connections",
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
    logger.debug("Received response from data connections API")

    // Validate the API response against the expected schema
    const validatedData =
      DataConnectionsApiV1GetConnectionsResponseSchema.parse(data)

    if (!validatedData.success) {
      throw new Error("API returned unsuccessful operation")
    }

    logger.info("Successfully fetched data connections")

    return Object.values(validatedData.items)
  } catch (error) {
    throw new Error("Error fetching data connections", { cause: error })
  }
}

/**
 * Gets the latest sync end date from a data connection
 *
 * @param connection - The data connection
 * @returns The latest sync end date
 */
export function getDataConnectionLatestSyncEnd(
  connection: DataConnection
): Date | undefined {
  return connection.handlers.reduce((latest: Date | undefined, handler) => {
    if (!handler.latestSyncEnd) {
      return latest
    }

    const latestSyncEndDate = new Date(handler.latestSyncEnd)
    if (!isDate(latestSyncEndDate)) {
      return latest
    }

    if (!latest) {
      return latestSyncEndDate
    }

    return latestSyncEndDate.getTime() > latest.getTime()
      ? latestSyncEndDate
      : latest
  }, undefined)
}

/**
 * Gets the latest sync end date from a list of data connections
 *
 * @param connections - The list of data connections
 * @returns The latest sync end date
 */
export function getDataConnectionsLatestSyncEnd(
  connections: DataConnection[]
): Date | undefined {
  return connections.reduce((latest: Date | undefined, connection) => {
    const latestSyncEndDate = getDataConnectionLatestSyncEnd(connection)
    if (!latestSyncEndDate) {
      return latest
    }

    if (!latest) {
      return latestSyncEndDate
    }

    return latestSyncEndDate.getTime() > latest.getTime()
      ? latestSyncEndDate
      : latest
  }, undefined)
}
