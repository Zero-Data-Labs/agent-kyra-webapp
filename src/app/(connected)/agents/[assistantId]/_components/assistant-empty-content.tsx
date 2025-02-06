"use client"

import React, { useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import type { PromptInput } from "@/features/agent-chat/types"
import { SUGGESTED_PROMPTS } from "@/features/suggested-prompts/constants"
import { cn } from "@/styles/utils"

export type AssistantEmptyContentProps = React.ComponentProps<"div">

export function AssistantEmptyContent(props: AssistantEmptyContentProps) {
  const { className, ...divProps } = props

  const { setAndProcessPromptInput } = useAgentChat()

  const handleSuggestedPromptClick = useCallback(
    async (input: PromptInput) => {
      setAndProcessPromptInput(input)
    },
    [setAndProcessPromptInput]
  )

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      {...divProps}
    >
      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography variant="heading-4">Talk about your data</Typography>
          <Typography variant="base-regular">
            Ask questions to your agent about your personal data, for example:
          </Typography>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {SUGGESTED_PROMPTS.map((suggestedPrompt) => (
            <Button
              key={suggestedPrompt._id}
              variant="outline"
              className="h-auto rounded-full px-4 py-2.5"
              onClick={() => {
                handleSuggestedPromptClick(suggestedPrompt)
              }}
            >
              <Typography variant="base-s-regular">
                {suggestedPrompt.name}
              </Typography>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
AssistantEmptyContent.displayName = "AssistantEmptyContent"
