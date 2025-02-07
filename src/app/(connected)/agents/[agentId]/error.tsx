"use client"

import {
  ErrorPageContent,
  type ErrorPageProps,
} from "@/components/error-page-content"
import { AgentSelector } from "@/features/saved-agents/components/agent-selector"

export default function AgentErrorPage(props: ErrorPageProps) {
  const { error, reset } = props

  return (
    <ErrorPageContent
      mainMessage="There was an error loading the AI Agent"
      error={error}
      reset={reset}
      hideNavigationButton
    >
      <AgentSelector
        className="w-[calc(100vw-1rem)] max-w-sm border"
        hideSearch
      />
    </ErrorPageContent>
  )
}
AgentErrorPage.displayName = "AgentErrorPage"
