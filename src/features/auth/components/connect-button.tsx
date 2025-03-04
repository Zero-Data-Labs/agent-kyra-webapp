import Image from "next/image"
import Link from "next/link"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { buildAuthUrl } from "@/features/auth/utils"
import { cn } from "@/styles/utils"

const authUrl = buildAuthUrl()

export interface ConnectButtonProps
  extends Omit<ComponentProps<typeof Button>, "children" | "onClick"> {}

export function ConnectButton(props: ConnectButtonProps) {
  const { className, ...buttonProps } = props

  return (
    <Button
      className={cn("w-full sm:w-fit", className)}
      {...buttonProps}
      asChild
    >
      <Link href={authUrl} className="flex flex-row items-center gap-2">
        <Image
          src="/images/verida-network-logo.svg"
          alt="Verida Network Logo"
          className="size-6"
          width={144}
          height={144}
        />
        <span>Connect Verida</span>
      </Link>
    </Button>
  )
}
ConnectButton.displayName = "ConnectButton"
