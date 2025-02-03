"use client"

import React from "react"

import { AiAssistantSelector } from "@/app/(connected)/agents/[assistantId]/_components/ai-assistant-selector"
import {
  ErrorPageContent,
  type ErrorPageProps,
} from "@/components/error-page-content"

export default function AssistantErrorPage(props: ErrorPageProps) {
  const { error, reset } = props

  return (
    <ErrorPageContent
      mainMessage="There was an error loading the AI Assistant"
      error={error}
      reset={reset}
      hideNavigationButton
    >
      <AiAssistantSelector
        className="w-[calc(100vw-1rem)] max-w-sm border"
        hideSearch
      />
    </ErrorPageContent>
  )
}
AssistantErrorPage.displayName = "AssistantErrorPage"
