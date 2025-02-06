import { z } from "zod"

import {
  SavedPromptBaseSchema,
  SavedPromptFormDataSchema,
} from "@/features/saved-prompts/schemas"
import type { VeridaRecord } from "@/features/verida-database/types"

export type SavedPromptBase = z.infer<typeof SavedPromptBaseSchema>

export type SavedPromptRecord = VeridaRecord<SavedPromptBase>

export type SavedPromptFormData = z.infer<typeof SavedPromptFormDataSchema>
