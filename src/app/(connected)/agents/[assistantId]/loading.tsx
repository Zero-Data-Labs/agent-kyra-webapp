import React from "react"

import {
  LoadingBlock,
  LoadingBlockDescription,
  LoadingBlockSpinner,
  LoadingBlockTitle,
  LoadingProgress,
} from "@/components/ui/loading"
import type { AiAssistantHotloadResult } from "@/features/assistants/types"

type AssistantLoadingPageProps = {
  hotload?: AiAssistantHotloadResult
}

export default function AssistantLoadingPage(props: AssistantLoadingPageProps) {
  const { hotload } = props

  return (
    <div className="flex h-full flex-1 flex-row items-center justify-center">
      {hotload?.status === "loading" ? (
        <LoadingBlock className="w-full">
          <LoadingBlockTitle>Loading data...</LoadingBlockTitle>
          <LoadingProgress value={hotload.progress} className="max-w-96" />
          <LoadingBlockDescription>
            {`Loading your ${hotload.dataCurrentlyLoading || "data"} for the assistant... ${Math.round((hotload.progress || 0) * 100)}%`}
          </LoadingBlockDescription>
        </LoadingBlock>
      ) : (
        <LoadingBlock>
          <LoadingBlockSpinner />
          <LoadingBlockTitle>Preparing assistant...</LoadingBlockTitle>
          <LoadingBlockDescription>
            Please wait while we prepare your assistant
          </LoadingBlockDescription>
        </LoadingBlock>
      )}
    </div>
  )
}
AssistantLoadingPage.displayName = "AssistantLoadingPage"
