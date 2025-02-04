"use client"

import { LogOutIcon } from "lucide-react"
import { type ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { cn } from "@/styles/utils"

export type DisconnectButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick"
>

export function DisconnectButton(props: DisconnectButtonProps) {
  const { className, variant = "ghost", ...buttonProps } = props

  const { disconnect } = useVeridaAuth()

  return (
    <Button
      onClick={disconnect}
      className={cn(
        "w-12 gap-2 px-0 py-0 sm:w-auto sm:px-6 sm:py-2",
        className
      )}
      variant={variant}
      {...buttonProps}
    >
      <LogOutIcon className="size-4" />
      <span className="hidden sm:block">Disconnect</span>
    </Button>
  )
}
DisconnectButton.displayName = "DisconnectButton"
