import { z } from "zod"

// FIXME: Fix the supposedly circular dependency of importing SearchTypeSchema
// import { SearchTypeSchema } from "@/features/data-search/schemas"

export const LLM_PROVIDERS = ["bedrock"] as const
export const LlmProviderSchema = z.enum(LLM_PROVIDERS)

/**
 * @deprecated Temporarily deprecated for the new agent but may come back later
 */
export const LLM_MODELS = [
  "CLAUDE_HAIKU_3.5",
  "LLAMA3.2_3B",
  "LLAMA3.2_1B",
  "LLAMA3.1_70B",
  "LLAMA3.1_8B",
  "LLAMA3_70B",
  "LLAMA3_8B",
  "MIXTRAL_8_7B",
  "MIXTRAL_SMALL",
  "MIXTRAL_LARGE",
] as const
export const LlmModelSchema = z.enum(LLM_MODELS)

// TODO: Handle the mapping LLM models to providers

export const PrivateDataApiV1LlmHotloadResponseSchema = z.object({
  schema: z.string(),
  status: z.string(),
  recordCount: z.number(),
  totalProgress: z.number(),
})

export const PrivateDataApiV1LLMAgentResponseSchema = z.object({
  response: z.object({
    output: z.string().min(1, "LLM response is empty"),
  }),
  duration: z.number(),
})

export const PrivateDataApiV1LLMPersonalResponseSchema = z.object({
  result: z.string().min(1, "LLM response is empty"),
  duration: z.number(),
  process: z.object({
    // databases: z.array(SearchTypeSchema).optional(),
    databases: z.array(z.string()).optional(),
  }),
})
