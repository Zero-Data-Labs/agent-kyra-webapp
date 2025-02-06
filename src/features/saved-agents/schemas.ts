import { z } from "zod"

export const SavedAgentBaseSchema = z.object({
  name: z.string(),
  order: z.number().optional(),
})

export const SavedAgentFormDataSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters")
    .regex(
      /^[a-zA-Z0-9-_\s]+$/,
      "Name can only contain letters, numbers, hyphens, underscores and spaces"
    ),
})
