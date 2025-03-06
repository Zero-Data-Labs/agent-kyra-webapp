"use client"

import { ExternalLinkIcon } from "lucide-react"
import Link from "next/link"
import { type ComponentProps, useCallback } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import type { PromptInput } from "@/features/agent-chat/types"
import { useDataConnections } from "@/features/data-connections/hooks/use-data-connections"
import { SUGGESTED_PROMPTS } from "@/features/suggested-prompts/constants"
import { getVeridaVaultDataConnectionsPageURL } from "@/features/verida-vault/utils"
import { cn } from "@/styles/utils"

export interface ChatEmptyContentProps extends ComponentProps<"div"> {}

export function ChatEmptyContent(props: ChatEmptyContentProps) {
  const { className, ...divProps } = props

  const { setAndProcessPromptInput } = useAgentChat()

  const { connections, isLoading: isLoadingDataConnections } =
    useDataConnections()

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
            Ask questions to your agent about your personal data
          </Typography>
        </div>
        {isLoadingDataConnections ? null : connections?.length ? (
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
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <Alert variant="info">
              <div className="flex flex-col gap-4">
                <AlertDescription>
                  {`You don't seem to have any active data connections in your Verida Vault.`}
                </AlertDescription>
                <AlertDescription>
                  Your agent works best when it can tailor its responses to your
                  personal data. Connect your accounts to your Verida Vault to
                  get started.
                </AlertDescription>
                <Button
                  variant="outline"
                  className="h-auto self-center rounded-full px-4 py-2.5"
                  asChild
                >
                  <Link
                    href={getVeridaVaultDataConnectionsPageURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center gap-2"
                  >
                    <span>Connect your accounts</span>
                    <ExternalLinkIcon className="size-4" />
                  </Link>
                </Button>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}
ChatEmptyContent.displayName = "ChatEmptyContent"
