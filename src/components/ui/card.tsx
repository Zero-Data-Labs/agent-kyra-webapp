import React from "react"

import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-surface flex flex-col gap-6 rounded-lg border p-6 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"header">
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof Typography>
>(({ variant = "heading-3", className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant={variant}
    className={cn(className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof Typography> & { wrapperClassName?: string }
>(
  (
    { variant = "base-regular", className, wrapperClassName, ...props },
    ref
  ) => (
    <div className={cn("text-muted-foreground", wrapperClassName)}>
      <Typography
        ref={ref}
        variant={variant}
        className={cn(className)}
        {...props}
      />
    </div>
  )
)
CardDescription.displayName = "CardDescription"

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
CardBody.displayName = "CardBody"

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"footer">
>(({ className, ...props }, ref) => (
  <footer ref={ref} className={className} {...props} />
))
CardFooter.displayName = "CardFooter"
