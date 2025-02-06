import { z } from "zod"

import {
  SavedAgentBaseSchema,
  SavedAgentFormDataSchema,
} from "@/features/saved-agents/schemas"
import type { VeridaRecord } from "@/features/verida-database/types"

export type SavedAgentBase = z.infer<typeof SavedAgentBaseSchema>

export type SavedAgentRecord = VeridaRecord<SavedAgentBase>

export type SavedAgentFormData = z.infer<typeof SavedAgentFormDataSchema>
