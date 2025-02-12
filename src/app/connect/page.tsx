"use client"

import { redirect } from "next/navigation"

import { AuthenticationLoading } from "@/features/auth/components/authentication-loading"
import { useAuthRedirectPathState } from "@/features/auth/hooks/use-auth-redirect-path-state"
import { buildAuthUrl } from "@/features/auth/utils"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

// TODO: Pass the redirectPath as a state in the auth URL
const authUrl = buildAuthUrl()

export default function ConnectPage() {
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

  // If not authenticated, redirect automatically to the Verida Auth URL
  redirect(authUrl)
}
ConnectPage.displayName = "ConnectPage"
