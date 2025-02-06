import type { LLMModelDefinition, LlmModel } from "@/features/assistants/types"

export const LLM_MODEL_DEFS: Record<LlmModel, LLMModelDefinition> = {
  "CLAUDE_HAIKU_3.5": {
    provider: "bedrock",
    model: "CLAUDE_HAIKU_3.5",
    label: "Claude 3.5 Haiku",
  },
  "LLAMA3.2_3B": {
    provider: "bedrock",
    model: "LLAMA3.2_3B",
    label: "Llama 3.2 3B",
  },
  "LLAMA3.2_1B": {
    provider: "bedrock",
    model: "LLAMA3.2_1B",
    label: "Llama 3.2 1B",
  },
  "LLAMA3.1_70B": {
    provider: "bedrock",
    model: "LLAMA3.1_70B",
    label: "Llama 3.1 70B",
  },
  "LLAMA3.1_8B": {
    provider: "bedrock",
    model: "LLAMA3.1_8B",
    label: "Llama 3.1 8B",
  },
  "LLAMA3_70B": {
    provider: "bedrock",
    model: "LLAMA3_70B",
    label: "Llama 3 70B",
  },
  "LLAMA3_8B": {
    provider: "bedrock",
    model: "LLAMA3_8B",
    label: "Llama 3 8B",
  },
  "MIXTRAL_8_7B": {
    provider: "bedrock",
    model: "MIXTRAL_8_7B",
    label: "Mixtral 8 7B",
  },
  "MIXTRAL_SMALL": {
    provider: "bedrock",
    model: "MIXTRAL_SMALL",
    label: "Mixtral Small",
  },
  "MIXTRAL_LARGE": {
    provider: "bedrock",
    model: "MIXTRAL_LARGE",
    label: "Mixtral Large",
  },
}
