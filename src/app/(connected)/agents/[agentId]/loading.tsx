import {
  LoadingBlock,
  LoadingBlockDescription,
  LoadingBlockSpinner,
  LoadingBlockTitle,
  LoadingProgress,
} from "@/components/ui/loading"
import type { LlmApiHotloadResult } from "@/features/agent-chat/types"

export interface AgentLoadingPageProps {
  hotload?: LlmApiHotloadResult
}

export default function AgentLoadingPage(props: AgentLoadingPageProps) {
  const { hotload } = props

  return (
    <div className="flex h-full flex-1 flex-row items-center justify-center">
      {hotload?.status === "loading" ? (
        <LoadingBlock className="w-full">
          <LoadingBlockTitle>Loading data...</LoadingBlockTitle>
          <LoadingProgress value={hotload.progress} className="max-w-96" />
          <LoadingBlockDescription>
            {`Loading your ${hotload.dataCurrentlyLoading || "data"} for the agent... ${Math.round((hotload.progress || 0) * 100)}%`}
          </LoadingBlockDescription>
        </LoadingBlock>
      ) : (
        <LoadingBlock>
          <LoadingBlockSpinner />
          <LoadingBlockTitle>Preparing agent...</LoadingBlockTitle>
          <LoadingBlockDescription>
            Please wait while we prepare your agent
          </LoadingBlockDescription>
        </LoadingBlock>
      )}
    </div>
  )
}
AgentLoadingPage.displayName = "AgentLoadingPage"
