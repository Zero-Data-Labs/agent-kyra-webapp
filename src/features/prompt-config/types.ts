import { z } from "zod"

import {
  PromptConfigCommonDataTypeSchema,
  PromptConfigDataTypesSchema,
  PromptConfigEmailDataTypeSchema,
  PromptConfigFormDataSchema,
  PromptConfigSchema,
  PromptSearchConfigSchema,
  PromptSearchOutputTypeSchema,
  PromptSearchProfileInformationTypeSchema,
  PromptSearchSortSchema,
  PromptSearchTimeframeSchema,
} from "@/features/prompt-config/schemas"

export type PromptSearchTimeframe = z.infer<typeof PromptSearchTimeframeSchema>

export type PromptSearchSort = z.infer<typeof PromptSearchSortSchema>

export type PromptSearchOutputType = z.infer<
  typeof PromptSearchOutputTypeSchema
>

export type PromptSearchProfileInformationType = z.infer<
  typeof PromptSearchProfileInformationTypeSchema
>

export type PromptSearchConfig = z.infer<typeof PromptSearchConfigSchema>

export type PromptConfigCommonDataType = z.infer<
  typeof PromptConfigCommonDataTypeSchema
>

export type PromptConfigEmailDataType = z.infer<
  typeof PromptConfigEmailDataTypeSchema
>

export type PromptConfigDataTypes = z.infer<typeof PromptConfigDataTypesSchema>

export type PromptConfig = z.infer<typeof PromptConfigSchema>

export type PromptConfigFormData = z.infer<typeof PromptConfigFormDataSchema>
