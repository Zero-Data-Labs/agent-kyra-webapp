import type { SavedPromptRecord } from "@/features/saved-prompts/types"

export const SUGGESTED_PROMPTS: SavedPromptRecord[] = [
  {
    _id: "1",
    assistantId: "new",
    name: "What do I have to focus on today?",
    prompt:
      "You are a personal assistant. Create an agenda of what I need to focus on today by looking at my emails, calendar and messages.",
  },
  {
    _id: "2",
    assistantId: "new",
    name: "Summarize my latest emails",
    prompt:
      "Summarize the last 24 hours of emails and messages I have received",
  },
  {
    _id: "3",
    assistantId: "new",
    name: "Create an agenda for my upcoming meeting",
    prompt:
      "Summarize recent conversations and prepare a draft agenda for my upcoming meeting with from",
  },
  {
    _id: "4",
    assistantId: "new",
    name: "How much have I spent on amazon last month?",
    prompt: "How much have I spent on amazon last month?",
  },
]
