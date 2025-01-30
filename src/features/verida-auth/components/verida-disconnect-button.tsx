"use client"

import { type ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { cn } from "@/styles/utils"

export type VeridaDisconnectButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onClick"
>

export function VeridaDisconnectButton(props: VeridaDisconnectButtonProps) {
  const { className, variant = "outline-destructive", ...buttonProps } = props

  const { disconnect } = useVeridaAuth()

  return (
    <Button
      onClick={disconnect}
      className={cn("", className)}
      variant={variant}
      {...buttonProps}
    >
      Disconnect
    </Button>
  )
}
VeridaDisconnectButton.displayName = "VeridaDisconnectButton"
