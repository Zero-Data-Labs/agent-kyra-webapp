import { z } from "zod"

import {
  VeridaBaseRecordSchema,
  VeridaBaseUnsavedRecordSchema,
} from "@/features/verida-database/schemas"

export type DatabaseDefinition = {
  title: string
  titlePlural: string
  databaseVaultName: string
  schemaUrlBase: string
  schemaUrlLatest: string
}

export type VeridaBaseRecord = z.infer<typeof VeridaBaseRecordSchema>

export type VeridaRecord<T = Record<string, unknown>> = VeridaBaseRecord & T

export type VeridaBaseUnsavedRecord = z.infer<
  typeof VeridaBaseUnsavedRecordSchema
>

export type UnsavedVeridaRecord<T = Record<string, unknown>> =
  VeridaBaseUnsavedRecord & T

export type VeridaDatabaseQueryFilter<T = Record<string, unknown>> = {
  [K in keyof T | `${string}.${string}`]?:
    | T[K & keyof T]
    | {
        $eq?: T[K & keyof T]
        $ne?: T[K & keyof T]
        $gt?: T[K & keyof T]
        $gte?: T[K & keyof T]
        $lt?: T[K & keyof T]
        $lte?: T[K & keyof T]
        $in?: T[K & keyof T][]
        $nin?: T[K & keyof T][]
        $exists?: boolean
        $type?: string
        $mod?: [number, number]
        $regex?: string
        $options?: string
      }
    | VeridaDatabaseQueryFilter<T[K & keyof T]>
}

export type VeridaDatabaseQueryOptions<T = Record<string, unknown>> = {
  sort?: Partial<Record<keyof T, "asc" | "desc">>[] // TODO: Make it work on nested objects as well
  limit?: number
  skip?: number
}

export type FetchVeridaRecordsResult<T = Record<string, unknown>> = {
  records: VeridaRecord<T>[]
  pagination: {
    limit: number | null
    skipped: number | null
    unfilteredTotalRecordsCount: number | null
  }
}
