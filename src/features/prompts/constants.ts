import type { DatabaseDefinition } from "@/features/verida-database/types"

export const AI_PROMPTS_DB_DEF: DatabaseDefinition = {
  title: "User Prompt",
  titlePlural: "User Prompts",
  databaseVaultName: "ai_prompt",
  schemaUrlBase: "https://common.schemas.verida.io/ai/prompt",
  schemaUrlLatest:
    "https://common.schemas.verida.io/ai/prompt/v0.1.0/schema.json",
}
