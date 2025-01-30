import Image from "next/image"
import React from "react"

import SuccessIllustration from "@/assets/success-illustration.svg"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export type SuccessBlockProps = React.ComponentProps<"div">

export function SuccessBlock(props: SuccessBlockProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...divProps}
    />
  )
}
SuccessBlock.displayName = "SuccessBlock"

export function SuccessBlockImage() {
  return (
    <Image
      src={SuccessIllustration}
      width={121}
      height={140}
      alt=""
      className="h-[105px] md:h-[140px]"
    />
  )
}
SuccessBlockImage.displayName = "SuccessBlockImage"

export type SuccessBlockTitleProps = React.ComponentProps<typeof Typography>

export function SuccessBlockTitle(props: SuccessBlockTitleProps) {
  const { variant = "heading-4", ...typographyProps } = props

  return <Typography variant={variant} component="p" {...typographyProps} />
}
SuccessBlockTitle.displayName = "SuccessBlockTitle"

export type SuccessBlockDescriptionProps = React.ComponentProps<
  typeof Typography
>

export function SuccessBlockDescription(props: SuccessBlockDescriptionProps) {
  const { variant = "base-regular", ...typographyProps } = props

  return (
    <div className="text-muted-foreground">
      <Typography variant={variant} {...typographyProps} />
    </div>
  )
}
SuccessBlockDescription.displayName = "SuccessBlockDescription"
