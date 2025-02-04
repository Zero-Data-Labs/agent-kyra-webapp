import React, { use } from "react"

import { AiAssistantCombobox } from "@/app/(connected)/agents/[assistantId]/_components/ai-assistant-combobox"
import { PageWrapper } from "@/components/page-wrapper"
import { Typography } from "@/components/ui/typography"
import { DisconnectButton } from "@/features/auth/components/disconnect-button"

type AssistantLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    assistantId: string
  }>
}

export default function AssistantLayout(props: AssistantLayoutProps) {
  const { children, params } = props

  const { assistantId: encodedAssistantId } = use(params)
  const assistantId = decodeURIComponent(encodedAssistantId)

  return (
    <PageWrapper
      className="gap-2 sm:gap-3 md:gap-6"
      pageTitle={
        <div className="flex min-w-0 flex-row items-center gap-2">
          <Typography variant="heading-3" className="shrink-0">
            AI Agent
          </Typography>
          <AiAssistantCombobox assistantId={assistantId} className="flex-1" />
        </div>
      }
      rightContent={<DisconnectButton />}
    >
      {children}
    </PageWrapper>
  )
}
AssistantLayout.displayName = "AssistantLayout"
