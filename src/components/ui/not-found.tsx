import Image from "next/image"
import React from "react"

import ErrorIllustration from "@/assets/error-illustration.svg"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export type NotFoundBlockProps = React.ComponentProps<"div">

export function NotFoundBlock(props: NotFoundBlockProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...divProps}
    />
  )
}
NotFoundBlock.displayName = "NotFoundBlock"

export function NotFoundBlockImage() {
  return (
    <Image
      src={ErrorIllustration}
      width={121}
      height={140}
      alt=""
      className="h-[105px] md:h-[140px]"
    />
  )
}
NotFoundBlockImage.displayName = "NotFoundBlockImage"

export type NotFoundBlockTitleProps = React.ComponentProps<typeof Typography>

export function NotFoundBlockTitle(props: NotFoundBlockTitleProps) {
  const { variant = "heading-4", ...typographyProps } = props

  return <Typography variant={variant} component="p" {...typographyProps} />
}
NotFoundBlockTitle.displayName = "NotFoundBlockTitle"

export type NotFoundBlockDescriptionProps = React.ComponentProps<
  typeof Typography
>

export function NotFoundBlockDescription(props: NotFoundBlockDescriptionProps) {
  const { variant = "base-regular", ...typographyProps } = props

  return (
    <div className="text-muted-foreground">
      <Typography variant={variant} {...typographyProps} />
    </div>
  )
}
NotFoundBlockDescription.displayName = "NotFoundBlockDescription"
