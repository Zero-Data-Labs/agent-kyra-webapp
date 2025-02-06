"use client"

import { AssistantEmptyContent } from "@/app/(connected)/agents/[assistantId]/_components/assistant-empty-content"
import { AssistantOutputCard } from "@/app/(connected)/agents/[assistantId]/_components/assistant-output-card"
import {
  ErrorBlock,
  ErrorBlockDescription,
  ErrorBlockImage,
  ErrorBlockTitle,
} from "@/components/ui/error"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"

export function AssistantOutput() {
  const { agentOutput, error } = useAgentChat()

  return (
    // TODO: Manage when the hotloading had an error
    <>
      {agentOutput ? (
        <AssistantOutputCard />
      ) : error ? (
        <ErrorBlock className="mt-2">
          <ErrorBlockImage />
          <ErrorBlockTitle>Error</ErrorBlockTitle>
          <ErrorBlockDescription>
            {error ?? "Something went wrong with the agent. Please try again."}
          </ErrorBlockDescription>
        </ErrorBlock>
      ) : (
        <AssistantEmptyContent className="mt-2" />
      )}
    </>
  )
}
AssistantOutput.displayName = "AssistantOutput"
