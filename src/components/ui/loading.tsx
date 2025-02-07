import type { ComponentProps } from "react"

import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export interface LoadingBlockProps extends ComponentProps<"div"> {}

export function LoadingBlock(props: LoadingBlockProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...divProps}
    />
  )
}
LoadingBlock.displayName = "LoadingBlock"

export interface LoadingBlockSpinnerProps
  extends ComponentProps<typeof Spinner> {}

export function LoadingBlockSpinner(props: LoadingBlockSpinnerProps) {
  return <Spinner {...props} />
}
LoadingBlockSpinner.displayName = "LoadingBlockSpinner"

export interface LoadingBlockTitleProps
  extends ComponentProps<typeof Typography> {}

export function LoadingBlockTitle(props: LoadingBlockTitleProps) {
  const { variant = "heading-4", ...typographyProps } = props

  return <Typography variant={variant} component="p" {...typographyProps} />
}
LoadingBlockTitle.displayName = "LoadingBlockTitle"

export interface LoadingBlockDescriptionProps
  extends ComponentProps<typeof Typography> {}

export function LoadingBlockDescription(props: LoadingBlockDescriptionProps) {
  const { variant = "base-regular", ...typographyProps } = props

  return (
    <div className="text-muted-foreground">
      <Typography variant={variant} {...typographyProps} />
    </div>
  )
}
LoadingBlockDescription.displayName = "LoadingBlockDescription"

export interface LoadingProgressProps extends ComponentProps<typeof Progress> {}

export function LoadingProgress(props: LoadingProgressProps) {
  return <Progress {...props} />
}
LoadingProgress.displayName = "LoadingProgress"
