"use client"

import { MessageSquareMoreIcon } from "lucide-react"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { use, useEffect } from "react"
import { useMediaQuery } from "usehooks-ts"

import { AiSecurityDetailsDialog } from "@/app/(connected)/agents/[agentId]/_components/ai-security-details-dialog"
import { ChatOutput } from "@/app/(connected)/agents/[agentId]/_components/chat-output"
import { ChatUserInput } from "@/app/(connected)/agents/[agentId]/_components/chat-user-input"
import { PromptSelector } from "@/app/(connected)/agents/[agentId]/_components/prompt-selector"
import AgentLoadingPage from "@/app/(connected)/agents/[agentId]/loading"
import { Card } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { getAgentPageRoute } from "@/features/routes/utils"
import { DEFAULT_AGENT } from "@/features/saved-agents/constants"
import { useGetSavedAgent } from "@/features/saved-agents/hooks/use-get-saved-agent"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { getMediaQuery } from "@/styles/utils"

export type AgentPageProps = {
  params: Promise<{
    agentId: string
  }>
}

export default function AgentPage(props: AgentPageProps) {
  const { params } = props

  const { agentId: encodedAgentId } = use(params)
  const agentId = decodeURIComponent(encodedAgentId)

  const searchParams = useSearchParams()
  const fromDeletion = searchParams.get("fromDeletion") === "true"

  const router = useRouter()

  const { setSelectedAgent, hotload } = useAgentChat()

  useEffect(() => {
    setSelectedAgent(agentId)
  }, [agentId, setSelectedAgent])

  const { savedAgent, isLoading: isLoadingSavedAgent } = useGetSavedAgent(
    {
      agentId,
    },
    {
      enabled: agentId !== DEFAULT_AGENT._id,
    }
  )

  const { savedAgents, isLoading: isLoadingSavedAgents } = useGetSavedAgents()

  useEffect(() => {
    if (
      !fromDeletion && // Only redirect if not from deletion
      savedAgents &&
      savedAgents.length > 0 &&
      agentId === DEFAULT_AGENT._id
    ) {
      const firstAgentId = savedAgents[0]!._id
      router.replace(getAgentPageRoute({ agentId: firstAgentId }))
    }
  }, [savedAgents, agentId, router, fromDeletion])

  const isXL = useMediaQuery(getMediaQuery("xl"))

  if (
    isLoadingSavedAgent ||
    isLoadingSavedAgents ||
    hotload.status === "loading"
  ) {
    return <AgentLoadingPage hotload={hotload} />
  }

  // TODO: Display alert if hotloading failed

  if (savedAgent || agentId === DEFAULT_AGENT._id) {
    return (
      <div className="flex h-full w-full flex-row justify-center gap-6">
        {isXL ? (
          <aside>
            <Card className="w-[26.5rem] gap-3 rounded-xl p-3">
              <div className="flex flex-row items-center gap-2 px-1 pt-1 text-muted-foreground">
                <MessageSquareMoreIcon className="size-5 sm:size-6" />
                <Typography variant="base-semibold">
                  Your prompts{savedAgent ? ` for ${savedAgent.name}` : ""}
                </Typography>
              </div>
              <PromptSelector />
            </Card>
          </aside>
        ) : null}
        <div className="flex h-full w-full max-w-screen-md flex-1 flex-col gap-4 xl:max-w-none">
          <div className="sticky top-2 z-10 sm:top-3 md:top-6">
            <ChatUserInput />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-row items-center justify-end gap-4 px-3 md:px-4">
              <AiSecurityDetailsDialog />
            </div>
            <ChatOutput />
          </div>
        </div>
      </div>
    )
  }

  notFound()
}
AgentPage.displayName = "AgentPage"
