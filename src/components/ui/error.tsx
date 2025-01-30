import Image from "next/image"
import React from "react"

import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export type ErrorBlockProps = React.ComponentProps<"div">

export function ErrorBlock(props: ErrorBlockProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...divProps}
    />
  )
}
ErrorBlock.displayName = "ErrorBlock"

export function ErrorBlockImage() {
  return (
    <Image
      src={"/images/error-illustration.svg"}
      width={121}
      height={140}
      alt=""
      className="h-[105px] md:h-[140px]"
    />
  )
}
ErrorBlockImage.displayName = "ErrorBlockImage"

export type ErrorBlockTitleProps = React.ComponentProps<typeof Typography>

export function ErrorBlockTitle(props: ErrorBlockTitleProps) {
  const { variant = "heading-4", ...typographyProps } = props

  return <Typography variant={variant} component="p" {...typographyProps} />
}
ErrorBlockTitle.displayName = "ErrorBlockTitle"

export type ErrorBlockDescriptionProps = React.ComponentProps<typeof Typography>

export function ErrorBlockDescription(props: ErrorBlockDescriptionProps) {
  const { variant = "base-regular", ...typographyProps } = props

  return (
    <div className="text-muted-foreground">
      <Typography variant={variant} {...typographyProps} />
    </div>
  )
}
ErrorBlockDescription.displayName = "ErrorBlockDescription"
