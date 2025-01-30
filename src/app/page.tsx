"use client"

import { useMemo } from "react"

import { Typography } from "@/components/ui/typography"
import { VeridaConnectButton } from "@/features/verida-auth/components/verida-connect-button"
import { VeridaDisconnectButton } from "@/features/verida-auth/components/verida-disconnect-button"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

export default function RootPage() {
  const { status } = useVeridaAuth()

  const isAuthenticated = useMemo(() => status === "authenticated", [status])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Typography variant="heading-1">
        {isAuthenticated
          ? "Connected to Verida"
          : "Landing page when not connected"}
      </Typography>
      {isAuthenticated ? <VeridaDisconnectButton /> : <VeridaConnectButton />}
    </div>
  )
}
RootPage.displayName = "RootPage"
