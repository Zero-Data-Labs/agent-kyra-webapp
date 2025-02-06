"use client"

import { MessageSquareMoreIcon } from "lucide-react"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { use, useEffect } from "react"
import { useMediaQuery } from "usehooks-ts"

import { AiPromptSelector } from "@/app/(connected)/agents/[assistantId]/_components/ai-prompt-selector"
import { AssistantOutput } from "@/app/(connected)/agents/[assistantId]/_components/assistant-output"
import { AssistantSecurityDetailsDialog } from "@/app/(connected)/agents/[assistantId]/_components/assistant-security-details-dialog"
import { AssistantUserInput } from "@/app/(connected)/agents/[assistantId]/_components/assistant-user-input"
import AssistantLoadingPage from "@/app/(connected)/agents/[assistantId]/loading"
import { Card } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { getAgentPageRoute } from "@/features/routes/utils"
import { DEFAULT_AGENT } from "@/features/saved-agents/constants"
import { useGetSavedAgent } from "@/features/saved-agents/hooks/use-get-saved-agent"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { getMediaQuery } from "@/styles/utils"

type AssistantPageProps = {
  params: Promise<{
    assistantId: string
  }>
}

export default function AssistantPage(props: AssistantPageProps) {
  const { params } = props

  const { assistantId: encodedAssistantId } = use(params)
  const assistantId = decodeURIComponent(encodedAssistantId)
  const searchParams = useSearchParams()
  const fromDeletion = searchParams.get("fromDeletion") === "true"

  const router = useRouter()

  const { setSelectedAgent, hotload } = useAgentChat()

  useEffect(() => {
    setSelectedAgent(assistantId)
  }, [assistantId, setSelectedAgent])

  const { savedAgent, isLoading: isLoadingSavedAgent } = useGetSavedAgent(
    {
      agentId: assistantId,
    },
    {
      enabled: assistantId !== DEFAULT_AGENT._id,
    }
  )

  const { savedAgents, isLoading: isLoadingSavedAgents } = useGetSavedAgents()

  useEffect(() => {
    if (
      !fromDeletion && // Only redirect if not from deletion
      savedAgents &&
      savedAgents.length > 0 &&
      assistantId === DEFAULT_AGENT._id
    ) {
      const firstAgentId = savedAgents[0]!._id
      router.replace(getAgentPageRoute({ agentId: firstAgentId }))
    }
  }, [savedAgents, assistantId, router, fromDeletion])

  const isXL = useMediaQuery(getMediaQuery("xl"))

  if (
    isLoadingSavedAgent ||
    isLoadingSavedAgents ||
    hotload.status === "loading"
  ) {
    return <AssistantLoadingPage hotload={hotload} />
  }

  // TODO: Display alert if hotloading failed

  if (savedAgent || assistantId === DEFAULT_AGENT._id) {
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
              <AiPromptSelector />
            </Card>
          </aside>
        ) : null}
        <div className="flex h-full w-full max-w-screen-md flex-1 flex-col gap-4 xl:max-w-none">
          <div className="sticky top-2 z-10 sm:top-3 md:top-6">
            <AssistantUserInput />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-row items-center justify-end gap-4 px-3 md:px-4">
              <AssistantSecurityDetailsDialog />
            </div>
            <AssistantOutput />
          </div>
        </div>
      </div>
    )
  }

  notFound()
}
AssistantPage.displayName = "AssistantPage"
