"use client"

import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { AuthenticationLoading } from "@/features/auth/components/authentication-loading"
import { useAuthRedirectPathState } from "@/features/auth/hooks/use-auth-redirect-path-state"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

export interface RootAuthenticationHandlerProps {
  children: ReactNode
}

export function RootAuthenticationHandler(
  props: RootAuthenticationHandlerProps
) {
  const { children } = props

  const { status } = useVeridaAuth()
  const { redirectPath } = useAuthRedirectPathState()

  if (status === "authenticated") {
    redirect(redirectPath)
  }

  if (status === "loading") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
        <AuthenticationLoading />
      </div>
    )
  }

  return <>{children}</>
}
RootAuthenticationHandler.displayName = "RootAuthenticationHandler"
