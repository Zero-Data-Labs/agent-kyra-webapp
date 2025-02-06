import type { DatabaseDefinition } from "@/features/verida-database/types"

export const AI_ASSISTANTS_DB_DEF: DatabaseDefinition = {
  title: "AI Assistant",
  titlePlural: "AI Assistants",
  databaseVaultName: "ai_assistant",
  schemaUrlBase: "https://common.schemas.verida.io/ai/assistant",
  schemaUrlLatest:
    "https://common.schemas.verida.io/ai/assistant/v0.1.0/schema.json",
}
