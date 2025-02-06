import React, { use } from "react"

import { AgentCombobox } from "@/app/(connected)/agents/[agentId]/_components/agent-combobox"
import { PageWrapper } from "@/components/page-wrapper"
import { Typography } from "@/components/ui/typography"
import { DisconnectButton } from "@/features/auth/components/disconnect-button"

export type AgentLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    agentId: string
  }>
}

export default function AgentLayout(props: AgentLayoutProps) {
  const { children, params } = props

  const { agentId: encodedAgentId } = use(params)
  const agentId = decodeURIComponent(encodedAgentId)

  return (
    <PageWrapper
      className="gap-2 sm:gap-3 md:gap-6"
      pageTitle={
        <div className="flex min-w-0 flex-row items-center gap-2">
          <Typography variant="heading-3" className="shrink-0">
            AI Agent
          </Typography>
          <AgentCombobox agentId={agentId} className="flex-1" />
        </div>
      }
      rightContent={<DisconnectButton />}
    >
      {children}
    </PageWrapper>
  )
}
AgentLayout.displayName = "AgentLayout"
