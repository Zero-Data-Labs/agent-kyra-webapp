"use client"

import { intlFormat } from "date-fns"
import { EllipsisVerticalIcon } from "lucide-react"
import { type ComponentProps, useMemo } from "react"

import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { EMPTY_VALUE_FALLBACK } from "@/constants/misc"
import { ChatAgentOutputCardMenu } from "@/features/agent-chat/components/chat-agent-output-card-menu"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { DEFAULT_AGENT } from "@/features/saved-agents/constants"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { cn } from "@/styles/utils"
import { SHORT_TIME_FORMAT_OPTIONS } from "@/utils/date"

export interface ChatAgentOutputCardProps extends ComponentProps<"div"> {}

export function ChatAgentOutputCard(props: ChatAgentOutputCardProps) {
  const { className, ...divProps } = props

  const { agentOutput } = useAgentChat()
  const { savedAgents } = useGetSavedAgents()

  const agent = useMemo(() => {
    if (!agentOutput?.agentId) {
      return undefined
    }

    const fromUserAgents = savedAgents?.find(
      (a) => a._id === agentOutput.agentId
    )

    if (fromUserAgents) {
      return fromUserAgents
    }

    if (agentOutput.agentId === DEFAULT_AGENT._id) {
      return DEFAULT_AGENT
    }

    return undefined
  }, [agentOutput?.agentId, savedAgents])

  const processedAt = useMemo(() => {
    if (agentOutput?.status !== "processed") {
      return EMPTY_VALUE_FALLBACK
    }

    return intlFormat(agentOutput.processedAt, SHORT_TIME_FORMAT_OPTIONS)
  }, [agentOutput])

  const processingTimeInfo = useMemo(() => {
    if (agentOutput?.status !== "processed" || !agentOutput?.processingTime) {
      return undefined
    }

    const milliseconds = agentOutput.processingTime
    const totalSeconds = milliseconds / 1000
    let minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60

    // If less than a second, show milliseconds
    if (minutes === 0 && remainingSeconds < 1) {
      return `${milliseconds}ms`
    }

    // If less than a minute or 60 seconds, show seconds rounded up
    const roundedSeconds = Math.round(remainingSeconds)
    if (minutes === 0 && roundedSeconds < 60) {
      return `${roundedSeconds}s`
    }

    // If more than a minute, show minutes rounded up based on seconds
    if (remainingSeconds >= 30) {
      minutes += 1
    }
    return `${minutes}min`
  }, [agentOutput])

  const displayFooterInfo = useMemo(
    () =>
      !!processingTimeInfo &&
      !(!agentOutput || agentOutput?.status === "processing"),
    [processingTimeInfo, agentOutput]
  )

  return (
    <div className={className} {...divProps}>
      <Card className="gap-2 rounded-xl p-3 md:gap-3 md:p-4">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-start gap-2">
            <Avatar className="relative size-8 shrink-0 p-0 text-white sm:size-10">
              <AvatarImage src="/images/kyra-avatar.jpg" alt="Kyra avatar" />
            </Avatar>
            <div className="flex flex-col">
              <Typography variant="base-semibold">
                {agent ? agent.name : "Agent"}
              </Typography>
              {!agentOutput || agentOutput?.status === "processing" ? (
                <Skeleton className="my-[0.15rem] h-3 w-20 rounded-full" />
              ) : (
                <div className="text-muted-foreground">
                  <Typography variant="base-s-regular">
                    {processedAt}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          {agentOutput?.status === "processed" ? (
            <div className="flex flex-row items-center justify-end gap-2">
              <ChatAgentOutputCardMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 sm:size-10"
                >
                  <EllipsisVerticalIcon className="size-5 sm:size-6" />
                  <span className="sr-only">
                    Open Agent output actions menu
                  </span>
                </Button>
              </ChatAgentOutputCardMenu>
            </div>
          ) : null}
        </CardHeader>
        <CardBody>
          {!agentOutput || agentOutput?.status === "processing" ? (
            <ChatAgentOutputSkeleton className="w-full" />
          ) : (
            <MarkdownRenderer className="max-w-full overflow-x-auto">
              {agentOutput.result}
            </MarkdownRenderer>
          )}
        </CardBody>
        {displayFooterInfo ? (
          <CardFooter className="flex flex-row items-center justify-end text-end text-muted-foreground">
            <div className="flex flex-col gap-0">
              {processingTimeInfo ? (
                <Typography variant="base-s-regular">
                  {`Processed in ${processingTimeInfo}`}
                </Typography>
              ) : null}
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
ChatAgentOutputCard.displayName = "ChatAgentOutputCard"

interface ChatAgentOutputSkeletonProps
  extends Omit<ComponentProps<"div">, "children"> {}

function ChatAgentOutputSkeleton(props: ChatAgentOutputSkeletonProps) {
  const { className, ...divProps } = props

  return (
    <div className={cn("flex flex-col", className)} {...divProps}>
      <div className="flex flex-row gap-2">
        <Skeleton className="my-[0.3125rem] h-3.5 w-1/12 rounded-full" />
        <Skeleton className="my-[0.3125rem] h-3.5 w-9/12 rounded-full" />
        <Skeleton className="my-[0.3125rem] h-3.5 flex-1 rounded-full" />
      </div>
      <div className="flex flex-row gap-2">
        <Skeleton className="my-[0.3125rem] h-3.5 w-7/12 rounded-full" />
        <Skeleton className="my-[0.3125rem] h-3.5 flex-1 rounded-full" />
      </div>
      <div className="flex flex-row gap-2">
        <Skeleton className="my-[0.3125rem] h-3.5 w-4/12 rounded-full" />
        <Skeleton className="my-[0.3125rem] h-3.5 flex-1 rounded-full" />
      </div>
      <div className="flex flex-row gap-2">
        <Skeleton className="my-[0.3125rem] h-3.5 w-7/12 rounded-full" />
      </div>
    </div>
  )
}
ChatAgentOutputSkeleton.displayName = "ChatAgentOutputSkeleton"
