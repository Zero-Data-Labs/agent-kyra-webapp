import Link from "next/link"
import { type ComponentProps, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { commonConfig } from "@/config/common"
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
    const request = buildVeridaAuthRequest(commonConfig.BASE_URL)
    return buildVeridaAuthRequestUrl(request)
  }, [])

  return (
    <Button className={cn("", className)} {...buttonProps} asChild>
      <Link href={authUrl}>Connect with Verida</Link>
    </Button>
  )
}
VeridaConnectButton.displayName = "VeridaConnectButton"
