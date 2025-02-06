import { z } from "zod"

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
