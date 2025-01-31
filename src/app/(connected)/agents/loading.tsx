import React from "react"

import {
  LoadingBlock,
  LoadingBlockDescription,
  LoadingBlockSpinner,
  LoadingBlockTitle,
} from "@/components/ui/loading"

export default function AssistantsLoadingPage() {
  return (
    <div className="flex h-full flex-1 flex-row items-center justify-center p-4">
      <LoadingBlock>
        <LoadingBlockSpinner />
        <LoadingBlockTitle>Loading agent...</LoadingBlockTitle>
        <LoadingBlockDescription>
          Please wait while we connect to your agent
        </LoadingBlockDescription>
      </LoadingBlock>
    </div>
  )
}
AssistantsLoadingPage.displayName = "AssistantsLoadingPage"
