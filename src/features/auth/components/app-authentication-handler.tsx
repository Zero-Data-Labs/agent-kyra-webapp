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

  if (status === "unauthenticated") {
    redirectToAuthPage()
  }

  return <>{children}</>
}
AppAuthenticationHandler.displayName = "AppAuthenticationHandler"
