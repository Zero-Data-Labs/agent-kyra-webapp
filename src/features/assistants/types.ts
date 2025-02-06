import { z } from "zod"

import {
  LlmModelSchema,
  LlmProviderSchema,
  PrivateDataApiV1LLMAgentResponseSchema,
  PrivateDataApiV1LLMPersonalResponseSchema,
  PrivateDataApiV1LlmHotloadResponseSchema,
} from "@/features/assistants/schemas"
import type { PromptConfig } from "@/features/prompt-config/types"

export type AiAssistantHotloadStatus = "idle" | "loading" | "success" | "error"

export type AiAssistantHotloadResult = {
  status: AiAssistantHotloadStatus
  progress: number
  dataCurrentlyLoading?: string
}

export type LlmProvider = z.infer<typeof LlmProviderSchema>
export type LlmModel = z.infer<typeof LlmModelSchema>

export type LLMModelDefinition = {
  provider: LlmProvider
  model: LlmModel
  label: string
}

export type AiPromptInput = {
  assistantId?: string
  prompt?: string
  config?: {
    llmProvider?: LlmProvider
    llmModel?: LlmModel
    promptConfig?: PromptConfig
    // TODO: add further configuration options (data type, filters, etc.)
  }
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
      // databases?: SearchType[]
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

export type PrivateDataApiV1LLMPersonalRequestBody = {
  // TODO: When and if passing the assistantId is supported, add it here but handle when using the default non-existing assistant
  prompt: string
  provider: LlmProvider
  model: LlmModel
  promptConfig?: PromptConfig
}

export type PrivateDataApiV1LLMPersonalResponse = z.infer<
  typeof PrivateDataApiV1LLMPersonalResponseSchema
>

export type PrivateDataApiV1LlmHotloadResponse = z.infer<
  typeof PrivateDataApiV1LlmHotloadResponseSchema
>
