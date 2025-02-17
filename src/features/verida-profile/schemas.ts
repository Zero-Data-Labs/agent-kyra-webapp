import { z } from "zod"

import { VeridaBaseRecordSchema } from "@/features/verida-database/schemas"

export const VeridaProfileSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  avatar: z
    .object({
      uri: z.string().optional(),
    })
    .optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  username: z.string().optional(),
})

export const VeridaProfileApiResponseSchema = VeridaBaseRecordSchema.extend(
  VeridaProfileSchema.shape
)
