import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import type { HTMLAttributes } from "react"

import { cn } from "@/styles/utils"

export const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-2 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive-hover focus:ring-destructive",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge(props: BadgeProps) {
  const { className, variant, ...divProps } = props

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...divProps} />
  )
}
Badge.displayName = "Badge"
