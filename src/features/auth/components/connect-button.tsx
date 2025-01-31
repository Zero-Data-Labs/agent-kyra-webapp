import Link from "next/link"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { buildAuthUrl } from "@/features/auth/utils"
import { cn } from "@/styles/utils"

const authUrl = buildAuthUrl()

export type ConnectButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick"
>

export function ConnectButton(props: ConnectButtonProps) {
  const { className, ...buttonProps } = props

  return (
    <Button className={cn("", className)} {...buttonProps} asChild>
      <Link href={authUrl}>Connect with Verida</Link>
    </Button>
  )
}
ConnectButton.displayName = "ConnectButton"
