import React from "react"

import { AiAssistantSelector } from "@/app/(connected)/agents/[assistantId]/_components/ai-assistant-selector"
import {
  NotFoundBlock,
  NotFoundBlockDescription,
  NotFoundBlockImage,
  NotFoundBlockTitle,
} from "@/components/ui/not-found"

export default function AssistantNotFoundPage() {
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
      <AiAssistantSelector
        className="w-[calc(100vw-1rem)] max-w-sm border"
        hideSearch
      />
    </div>
  )
}
AssistantNotFoundPage.displayName = "AssistantNotFoundPage"
