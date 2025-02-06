import { z } from "zod"

import {
  PrivateDataApiV1LLMAgentResponseSchema,
  PrivateDataApiV1LlmHotloadResponseSchema,
} from "@/features/agent-chat/schemas"

export type LlmApiHotloadStatus = "idle" | "loading" | "success" | "error"

export type LlmApiHotloadResult = {
  status: LlmApiHotloadStatus
  progress: number
  dataCurrentlyLoading?: string
}

export type PromptInput = {
  agentId?: string
  prompt?: string
}

export type AgentOutput = {
  agentId?: string
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
