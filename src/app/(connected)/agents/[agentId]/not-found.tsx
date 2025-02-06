import React from "react"

import {
  NotFoundBlock,
  NotFoundBlockDescription,
  NotFoundBlockImage,
  NotFoundBlockTitle,
} from "@/components/ui/not-found"
import { AgentSelector } from "@/features/saved-agents/components/agent-selector"

export default function AgentNotFoundPage() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
      <NotFoundBlock>
        <NotFoundBlockImage />
        <NotFoundBlockTitle>Agent Not Found</NotFoundBlockTitle>
        <NotFoundBlockDescription>
          The agent you are looking for does not exist. Select one from your
          list:
        </NotFoundBlockDescription>
      </NotFoundBlock>
      <AgentSelector
        className="w-[calc(100vw-1rem)] max-w-sm border"
        hideSearch
      />
    </div>
  )
}
AgentNotFoundPage.displayName = "AgentNotFoundPage"
