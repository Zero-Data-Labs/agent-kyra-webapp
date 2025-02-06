import { z } from "zod"

export const SavedPromptBaseSchema = z.object({
  assistantId: z.string(),
  name: z.string(),
  prompt: z.string(),
  order: z.number().optional(),
})

export const SavedPromptFormDataSchema = z.object({
  name: z.string().min(1, "Label is required"),
  prompt: z.string().min(1, "Prompt is required"),
})
