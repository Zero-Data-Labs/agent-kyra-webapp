"use client"

import { useAuthRedirection } from "@/features/auth/hooks/use-auth-redirection"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

export interface AppAuthenticationHandlerProps {
  children: React.ReactNode
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
