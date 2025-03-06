import { type VariantProps, cva } from "class-variance-authority"
import { type ComponentProps, useMemo } from "react"

import { Typography } from "@/components/ui/typography"
import type {
  DataConnectionHandlerStatus,
  DataConnectionStatus,
} from "@/features/data-connections/types"
import { cn } from "@/styles/utils"

export const badgeVariants = cva(
  "inline-flex items-center rounded-md px-3 py-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        info: "bg-status-info text-status-info-foreground",
        success: "bg-status-success text-status-success-foreground",
        warning: "bg-status-warning text-status-warning-foreground",
        error: "bg-status-error text-status-error-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type DataConnectionStatusBadgeVariants = VariantProps<
  typeof badgeVariants
>

export interface DataConnectionStatusBadgeProps
  extends Omit<ComponentProps<"div">, "children"> {
  status: DataConnectionStatus | DataConnectionHandlerStatus
}

export function DataConnectionStatusBadge(
  props: DataConnectionStatusBadgeProps
) {
  const { status, className, ...divProps } = props

  const variant: DataConnectionStatusBadgeVariants["variant"] = useMemo(() => {
    switch (status) {
      case "connected":
      case "active":
      case "enabled":
      case "syncing":
        return "success"
      case "error":
      case "invalid-auth":
        return "error"
      case "paused":
        return "warning"
      case "disabled":
      default:
        return "default"
    }
  }, [status])

  const label = useMemo(() => {
    switch (status) {
      case "connected":
        return "Connected"
      case "error":
        return "Error"
      case "invalid-auth":
        return "Invalid Auth"
      case "paused":
        return "Paused"
      case "active":
      case "syncing":
        return "Syncing..."
      case "enabled":
        return "Enabled"
      case "disabled":
        return "Disabled"
      default:
        return "Unknown"
    }
  }, [status])

  const animate = useMemo(() => {
    return status === "syncing" || status === "active"
  }, [status])

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...divProps}>
      <Typography
        variant="base-semibold"
        component="p"
        className={cn("capitalize", animate ? "animate-pulse" : "")}
      >
        {label}
      </Typography>
    </div>
  )
}
DataConnectionStatusBadge.displayName = "DataConnectionStatusBadge"
