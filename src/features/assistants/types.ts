import { z } from "zod"

import {
  PrivateDataApiV1LLMAgentResponseSchema,
  PrivateDataApiV1LlmHotloadResponseSchema,
} from "@/features/assistants/schemas"

export type AiAssistantHotloadStatus = "idle" | "loading" | "success" | "error"

export type AiAssistantHotloadResult = {
  status: AiAssistantHotloadStatus
  progress: number
  dataCurrentlyLoading?: string
}

export type AiPromptInput = {
  assistantId?: string
  prompt?: string
}

export type AiAssistantOutput = {
  assistantId?: string
} & (
  | {
      status: "processing"
    }
  | {
      status: "processed"
      result: string
      processedAt: Date
      processingTime?: number
      databases?: string[]
    }
)

export type PrivateDataApiV1LLMAgentRequestBody = {
  prompt: string
  temperature?: number
}

export type PrivateDataApiV1LLMAgentResponse = z.infer<
  typeof PrivateDataApiV1LLMAgentResponseSchema
>

export type PrivateDataApiV1LlmHotloadResponse = z.infer<
  typeof PrivateDataApiV1LlmHotloadResponseSchema
>
