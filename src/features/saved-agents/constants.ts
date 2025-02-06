import type { SavedAgentRecord } from "@/features/saved-agents/types"
import type { DatabaseDefinition } from "@/features/verida-database/types"

export const MAX_NB_AGENTS = 5

export const DEFAULT_AGENT_ORDER = 100

export const DEFAULT_AGENT: SavedAgentRecord = {
  _id: "new",
  name: "Kyra",
}

export const AGENTS_DB_DEF: DatabaseDefinition = {
  title: "AI Assistant",
  titlePlural: "AI Assistants",
  databaseVaultName: "ai_assistant",
  schemaUrlBase: "https://common.schemas.verida.io/ai/assistant",
  schemaUrlLatest:
    "https://common.schemas.verida.io/ai/assistant/v0.1.0/schema.json",
}
