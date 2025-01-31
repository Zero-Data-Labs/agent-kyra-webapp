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

export const AiAssistantBaseSchema = z.object({
  name: z.string(),
  order: z.number().optional(),
})

export const AiAssistantFormDataSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters")
    .regex(
      /^[a-zA-Z0-9-_\s]+$/,
      "Name can only contain letters, numbers, hyphens, underscores and spaces"
    ),
})

export const AiPromptBaseSchema = z.object({
  assistantId: z.string(),
  name: z.string(),
  prompt: z.string(),
  order: z.number().optional(),
})

export const AiPromptFormDataSchema = z.object({
  name: z.string().min(1, "Label is required"),
  prompt: z.string().min(1, "Prompt is required"),
})

// Prompt search and config below are temporarily deprecated for the new agent but may come back later

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
