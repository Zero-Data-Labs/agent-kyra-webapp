import type {
  VeridaDatabaseQueryFilter,
  VeridaDatabaseQueryOptions,
} from "@/features/verida-database/types"

export const VeridaDatabaseQueryKeys = {
  records: <T = Record<string, unknown>>({
    databaseName,
    filter,
    options,
  }: {
    databaseName: string
    filter?: VeridaDatabaseQueryFilter<T>
    options?: VeridaDatabaseQueryOptions<T>
  }) => ["verida-database", "records", databaseName, filter, options],
  invalidateRecords: ({ databaseName }: { databaseName: string }) => [
    "verida-database",
    "records",
    databaseName,
  ],
  invalidateAllRecords: () => ["verida-database", "records"],
  record: ({
    databaseName,
    recordId,
  }: {
    databaseName: string
    recordId: string
  }) => ["verida-database", "record", databaseName, recordId],
  invalidateRecord: ({
    databaseName,
    recordId,
  }: {
    databaseName: string
    recordId: string
  }) => ["verida-database", "record", databaseName, recordId],
  invalidateAllRecordForDatabase: ({
    databaseName,
  }: {
    databaseName: string
  }) => ["verida-database", "record", databaseName],
  invalidateAllRecord: () => ["verida-database", "record"],
  invalidateAll: () => ["verida-database"],
}
