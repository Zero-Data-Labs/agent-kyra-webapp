"use client"

import Link from "next/link"
import { type ComponentProps, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  buildVeridaAuthRequest,
  buildVeridaAuthRequestUrl,
} from "@/features/verida-auth/utils"
import { cn } from "@/styles/utils"

export type VeridaConnectButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick"
>

export function VeridaConnectButton(props: VeridaConnectButtonProps) {
  const { className, ...buttonProps } = props

  const authUrl = useMemo(() => {
    const request = buildVeridaAuthRequest(window.location.href)
    return buildVeridaAuthRequestUrl(request)
  }, [])

  return (
    <Button className={cn("", className)} {...buttonProps} asChild>
      <Link href={authUrl}>Connect with Verida</Link>
    </Button>
  )
}
VeridaConnectButton.displayName = "VeridaConnectButton"
