import { z } from "zod"

import { VeridaProfileSchema } from "@/features/verida-profile/schemas"

export type VeridaProfile = z.infer<typeof VeridaProfileSchema>
