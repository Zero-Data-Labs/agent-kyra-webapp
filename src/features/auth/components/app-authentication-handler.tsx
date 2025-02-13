"use client"

import type { ReactNode } from "react"

import { useAuthRedirection } from "@/features/auth/hooks/use-auth-redirection"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

export interface AppAuthenticationHandlerProps {
  children: ReactNode
}

export function AppAuthenticationHandler(props: AppAuthenticationHandlerProps) {
  const { children } = props

  const { status } = useVeridaAuth()
  const { redirectToAuthPage } = useAuthRedirection()

  // TODO: Check the granted scopes compared to the expected ones. If they are
  // not the same we need to handle it (e.g. disabled impacted features, inform
  // user, provide ways to fix it by re-authenticating, etc.)

  // TODO: Handle when the token is invalid

  if (status === "unauthenticated") {
    redirectToAuthPage()
  }

  return <>{children}</>
}
AppAuthenticationHandler.displayName = "AppAuthenticationHandler"
