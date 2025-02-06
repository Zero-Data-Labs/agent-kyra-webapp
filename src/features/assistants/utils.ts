import { commonConfig } from "@/config/common"
import {
  PrivateDataApiV1LLMAgentResponseSchema,
  PrivateDataApiV1LlmHotloadResponseSchema,
} from "@/features/assistants/schemas"
import type {
  AiAssistantOutput,
  AiPromptInput,
  PrivateDataApiV1LLMAgentRequestBody,
} from "@/features/assistants/types"
import { Logger } from "@/features/telemetry/logger"

const logger = Logger.create("assistants")

/**
 * Processes an AI prompt by sending it to the AI assistant API.
 *
 * @param aiPromptInput - The prompt input to send
 * @param authToken - The token for authentication
 * @returns A promise that resolves to the AI assistant output
 * @throws Error if the prompt is empty or if there's an issue with the API call
 */
export async function sendAiPromptInputToAssistant(
  aiPromptInput: AiPromptInput,
  authToken: string
): Promise<AiAssistantOutput> {
  logger.info("Processing prompt input")

  if (!aiPromptInput.prompt) {
    throw new Error("Prompt is required")
  }

  // Explicitly building the body to ensure that the request is correct
  // Mostly because the structures are not the same
  // But also because aiPromptInput may have additional fields
  const body: PrivateDataApiV1LLMAgentRequestBody = {
    prompt: aiPromptInput.prompt,
  }

  try {
    logger.debug("Sending request to AI assistant API")

    const url = new URL(
      "/api/rest/v1/llm/agent",
      commonConfig.VERIDA_DATA_API_BASE_URL
    )

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    logger.debug("Received response from AI assistant API")

    // Validate the API response against the expected schema
    const validatedData = PrivateDataApiV1LLMAgentResponseSchema.parse(data)
    logger.info("Successfully processed prompt input")

    const output: AiAssistantOutput = {
      assistantId: aiPromptInput.assistantId,
      status: "processed",
      result: validatedData.response.output,
      processedAt: new Date(),
      processingTime: validatedData.duration,
      // databases: validatedData.process.databases,
    }

    return output
  } catch (error) {
    throw new Error("Error calling AI assistant API", { cause: error })
  }
}

/**
 * Initiates the hotloading process for the LLM API.
 *
 * @param authToken - The session token for authentication
 * @param progressCallback - Optional callback function to report progress
 * @returns A promise that resolves when hotloading is complete
 */
export function hotloadAPI(
  authToken: string,
  progressCallback?: (progress: number, dataCurrentlyLoading?: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.info("Starting AI assistant hotload")

    // Create an EventSource to receive progress updates
    const url = new URL(
      `${commonConfig.VERIDA_DATA_API_BASE_URL}/api/rest/v1/llm/hotload`
    )
    url.searchParams.append("api_key", authToken)
    const eventSource = new EventSource(url.toString())

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data)
      const validatedData =
        PrivateDataApiV1LlmHotloadResponseSchema.safeParse(parsedData)

      if (!validatedData.success) {
        // Unsure if the API only returns the progress response or something
        // else, like the retry count. In doubt, just disregard.
        return
      }

      const { data } = validatedData

      logger.debug(
        `AI assistant hotload progress: ${data.totalProgress * 100}%`
      )
      if (progressCallback) {
        progressCallback(data.totalProgress, data.schema)
      }

      // Check if hotloading is complete (using a threshold close to 1 to account for potential rounding issues)
      if (data.totalProgress >= 0.99999) {
        eventSource.close()
        logger.info("AI assistant hotload completed")
        resolve()
      }
    }

    eventSource.onerror = (error) => {
      eventSource.close()
      reject(new Error("Error hotloading AI assistant", { cause: error }))
    }
  })
}
