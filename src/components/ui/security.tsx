import { type VariantProps, cva } from "class-variance-authority"
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"
import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/styles/utils"

export type SecurityIconProps = React.ComponentProps<typeof ShieldCheckIcon>

export function SecurityIcon(props: SecurityIconProps) {
  const { className, ...iconProps } = props

  return (
    <ShieldCheckIcon
      className={cn(
        "size-4 shrink-0 text-status-secured-foreground",
        className
      )}
      {...iconProps}
    />
  )
}

const securityBadgeVariants = cva("", {
  variants: {
    variant: {
      default:
        "border-status-secured-foreground/50 bg-status-secured/50 text-status-secured-foreground hover:bg-status-secured/50",
      warning:
        "border-status-warning/50 bg-status-warning/5 text-status-warning hover:bg-status-warning/5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type SecuredBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "children" | "variant"
> &
  VariantProps<typeof securityBadgeVariants>

export function SecurityBadge(props: SecuredBadgeProps) {
  const { variant, className, ...divProps } = props

  return (
    <Badge
      className={cn(
        "gap-1 px-1 py-1 sm:px-2 sm:py-1",
        securityBadgeVariants({ variant }),
        className
      )}
      {...divProps}
    >
      {variant === "warning" ? (
        <ShieldAlertIcon className="size-4 text-inherit" />
      ) : (
        <SecurityIcon className="size-4 text-inherit" />
      )}
      <span className="hidden sm:block">
        {variant === "warning" ? "Security" : "Secured"}
      </span>
    </Badge>
  )
}
SecurityBadge.displayName = "SecurityBadge"

export const SecurityDetailsDialog = Dialog

export const SecurityDetailsDialogContent = DialogContent

export const SecurityDetailsDialogHeader = DialogHeader

export const SecurityDetailsDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentProps<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle
    ref={ref}
    className={cn("text-status-secured-foreground", className)}
    {...props}
  />
))
SecurityDetailsDialogTitle.displayName = "SecurityDetailsDialogTitle"

export const SecurityDetailsDialogDescription = DialogDescription

export const SecurityDetailsDialogBody = DialogBody

export const SecurityDetailsDialogFooter = DialogFooter

const securityDetailsDialogTriggerVariants = cva("", {
  variants: {
    variant: {
      default:
        "border-status-secured-foreground/50 bg-status-secured/50 text-status-secured-foreground hover:border-status-secured-foreground hover:bg-status-secured focus-visible:ring-status-secured-foreground",
      warning:
        "border-status-warning/50 bg-status-warning/5 text-status-warning hover:border-status-warning hover:bg-status-warning/10 focus-visible:ring-status-warning",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type SecurityDetailsDialogTriggerProps = Pick<
  React.ComponentProps<typeof Button>,
  "className"
> &
  VariantProps<typeof securityDetailsDialogTriggerVariants>

export function SecurityDetailsDialogTrigger(
  props: SecurityDetailsDialogTriggerProps
) {
  const { variant, className } = props

  return (
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "h-auto w-fit gap-1 rounded-full border px-1 py-1 text-xs font-semibold focus-visible:ring-offset-2 sm:px-2 sm:py-1",
          securityDetailsDialogTriggerVariants({ variant }),
          className
        )}
      >
        {variant === "warning" ? (
          <ShieldAlertIcon className="size-4 text-inherit" />
        ) : (
          <SecurityIcon className="size-4 text-inherit" />
        )}
        <span className="hidden sm:block">
          {variant === "warning" ? "Security" : "Secured"}
        </span>
        <span className="sr-only">Open security details</span>
      </Button>
    </DialogTrigger>
  )
}
SecurityDetailsDialogTrigger.displayName = "SecurityDetailsDialogTrigger"
