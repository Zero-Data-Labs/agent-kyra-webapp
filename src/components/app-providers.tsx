"use client"

import type { ReactNode } from "react"

import { AgentChatProvider } from "@/features/agent-chat/components/agent-chat-provider"

export interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders(props: AppProvidersProps) {
  const { children } = props

  // Put the providers requiring the user to be authenticated to the app. This should be most providers with any feature-related logic

  // For global providers required in any cases, use the RootProviders component.
  return <AgentChatProvider>{children}</AgentChatProvider>
}
AppProviders.displayName = "AppProviders"
