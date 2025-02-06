import { z } from "zod"

import { LlmModelSchema } from "@/features/assistants/schemas"

export const PROMPT_SEARCH_TIMEFRAMES = [
  "day",
  "week",
  "month",
  "quarter",
  "half-year",
  "full-year",
  "all",
] as const
export const PromptSearchTimeframeSchema = z.enum(PROMPT_SEARCH_TIMEFRAMES)

export const PROMPT_SEARCH_SORTS = ["keyword_rank", "recent", "oldest"] as const
export const PromptSearchSortSchema = z.enum(PROMPT_SEARCH_SORTS)

export const PROMPT_SEARCH_OUTPUT_TYPES = [
  "full_content",
  "summary",
  "headline",
] as const
export const PromptSearchOutputTypeSchema = z.enum(PROMPT_SEARCH_OUTPUT_TYPES)

export const PROMPT_SEARCH_PROFILE_INFORMATION_TYPES = [
  "name",
  "contactInfo",
  "demographics",
  "lifestyle",
  "preferences",
  "habits",
  "financial",
  "health",
  "personality",
  "employment",
  "education",
  "skills",
  "language",
  "interests",
] as const
export const PromptSearchProfileInformationTypeSchema = z.enum(
  PROMPT_SEARCH_PROFILE_INFORMATION_TYPES
)

export const PromptSearchConfigSchema = z.intersection(
  z.union([
    z.object({ search_type: z.literal("all") }),
    z.object({
      search_type: z.literal("keywords"),
      keywords: z.array(z.string()),
    }),
  ]),
  z.object({
    timeframe: PromptSearchTimeframeSchema,
    databases: z.array(z.string()),
    // databases: z.array(SearchTypeSchema),
    sort: PromptSearchSortSchema,
    output_type: PromptSearchOutputTypeSchema,
    profile_information: z.array(PromptSearchProfileInformationTypeSchema),
    search_summary: z.string().optional(),
  })
)

export const PromptConfigCommonDataTypeSchema = z.object({
  limit: z.number().optional(),
  maxLength: z.number().optional(),
  outputType: z.string().optional(),
})

export const PromptConfigEmailDataTypeSchema =
  PromptConfigCommonDataTypeSchema.extend({
    attachmentLength: z.number().optional(),
  })

export const PromptConfigDataTypesSchema = z.object({
  emails: PromptConfigEmailDataTypeSchema.optional(),
  chatMessages: PromptConfigCommonDataTypeSchema.optional(),
  favorites: PromptConfigCommonDataTypeSchema.optional(),
  following: PromptConfigCommonDataTypeSchema.optional(),
  files: PromptConfigCommonDataTypeSchema.optional(),
  calendarEvents: PromptConfigCommonDataTypeSchema.optional(),
})

export const PromptConfigSchema = z.object({
  dataTypes: PromptConfigDataTypesSchema.optional(),
  promptSearchConfig: PromptSearchConfigSchema.optional(),
})

export const PromptConfigFormDataSchema = z.object({
  llmModel: LlmModelSchema.optional(),
  rawPromptConfig: z
    .string()
    .optional()
    .superRefine((value, context) => {
      if (!value) {
        return
      }

      // Try to parse JSON
      let parsed
      try {
        parsed = JSON.parse(value)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid JSON format",
          fatal: true,
        })
        return z.NEVER
      }

      // Validate against PromptConfigSchema
      const result = PromptConfigSchema.safeParse(parsed)
      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Configuration format is invalid. Please check the documentation.",
        })
      }
    }),
})
