import { z } from "zod"

export const VeridaAuthTokenDetailsSchema = z.object({
  _id: z.string(),
  did: z.string(),
  appDID: z.string(),
  scopes: z.array(z.string()),
  servers: z.array(z.string()),
})

export const GetVeridaAuthTokenDetailsApiV1ResponseSchema = z.object({
  token: VeridaAuthTokenDetailsSchema,
})
