"use client"

import {
  ErrorBlock,
  ErrorBlockDescription,
  ErrorBlockImage,
  ErrorBlockTitle,
} from "@/components/ui/error"
import { ChatAgentOutputCard } from "@/features/agent-chat/components/chat-agent-output-card"
import { ChatEmptyContent } from "@/features/agent-chat/components/chat-empty-content"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"

export function ChatOutput() {
  const { agentOutput, error } = useAgentChat()

  return (
    // TODO: Manage when the hotloading had an error
    <>
      {agentOutput ? (
        <ChatAgentOutputCard />
      ) : error ? (
        <ErrorBlock className="mt-2">
          <ErrorBlockImage />
          <ErrorBlockTitle>Error</ErrorBlockTitle>
          <ErrorBlockDescription>
            {error ?? "Something went wrong with the agent. Please try again."}
          </ErrorBlockDescription>
        </ErrorBlock>
      ) : (
        <ChatEmptyContent className="mt-2" />
      )}
    </>
  )
}
ChatOutput.displayName = "ChatOutput"
