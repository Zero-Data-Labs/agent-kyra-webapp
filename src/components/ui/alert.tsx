import { type VariantProps, cva } from "class-variance-authority"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
} from "lucide-react"
import * as React from "react"

import { SecurityIcon } from "@/components/ui/security"
import { cn } from "@/styles/utils"

const alertVariants = cva(
  "bg-surface-hover relative w-full rounded border border-l-4 px-3 py-2",
  {
    variants: {
      variant: {
        info: "border-l-status-info text-status-info",
        success: "border-l-status-success text-status-success",
        secured:
          "border-l-status-secured-foreground text-status-secured-foreground",
        warning: "border-l-status-warning text-status-warning",
        error: "border-l-status-error text-status-error",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), "pl-10 text-start", className)}
    {...props}
  >
    <div className="absolute left-3 top-2">
      {variant === "info" ? <InfoIcon className="size-5" /> : null}
      {variant === "success" ? <CircleCheckIcon className="size-5" /> : null}
      {variant === "secured" ? <SecurityIcon className="size-5" /> : null}
      {variant === "warning" ? <CircleAlertIcon className="size-5" /> : null}
      {variant === "error" ? <CircleXIcon className="size-5" /> : null}
    </div>
    {children}
  </div>
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    // TODO: Use Typography
    ref={ref}
    className={cn("mb-1 font-medium leading-5 tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    // TODO: Use Typography
    ref={ref}
    className={cn("text-sm text-foreground", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
