import type { ComponentProps } from "react"

import { Typography } from "@/components/ui/typography"
import { ConnectButton } from "@/features/auth/components/connect-button"
import { cn } from "@/styles/utils"

export type LandingPageContentProps = Omit<ComponentProps<"div">, "children">

export function LandingPageContent(props: LandingPageContentProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4",
        className
      )}
      {...divProps}
    >
      <Typography variant="heading-1">Agent Kyra Landing page</Typography>
      <ConnectButton />
    </div>
  )
}
LandingPageContent.displayName = "LandingPageContent"
