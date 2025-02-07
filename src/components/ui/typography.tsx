import { type VariantProps, cva } from "class-variance-authority"
import React, { type ComponentPropsWithRef, type ReactNode } from "react"

import { cn } from "@/styles/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      "heading-1": "text-heading-1 sm:text-desktop-heading-1",
      "heading-2": "text-heading-2 sm:text-desktop-heading-2",
      "heading-3": "text-heading-3 sm:text-desktop-heading-3",
      "heading-4": "text-heading-4 sm:text-desktop-heading-4",
      "heading-5": "text-heading-5 sm:text-desktop-heading-5",
      "base-l": "text-base-l",
      "base-regular": "text-base-regular",
      "base-semibold": "text-base-semibold",
      "base-s-regular": "text-base-s-regular",
      "base-s-semibold": "text-base-s-semibold",
    },
    component: {
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
      h6: "",
      p: "",
      span: "",
    },
  },
  defaultVariants: {
    variant: "base-regular",
    component: "p",
  },
})

export type TypographyVariants = VariantProps<typeof typographyVariants>

export interface TypographyProps
  extends TypographyVariants,
    // FIXME: The actual component is not a div but can be a h1, h2, h3, h4, h5, h6, p, span depending on the variant and props
    Omit<ComponentPropsWithRef<"div">, "children"> {
  children?: ReactNode
}

const mapping: Record<
  NonNullable<TypographyVariants["variant"]>,
  NonNullable<TypographyVariants["component"]>
> = {
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3",
  "heading-4": "h4",
  "heading-5": "h5",
  "base-regular": "p",
  "base-semibold": "p",
  "base-l": "p",
  "base-s-regular": "p",
  "base-s-semibold": "p",
}

export function Typography(props: TypographyProps) {
  const { variant, component, children, className, ...otherProps } = props

  const classes = cn(typographyVariants({ variant }), className)

  const Tag = component || mapping[variant || "base-regular"]
  return (
    <Tag className={classes} {...otherProps}>
      {children}
    </Tag>
  )
}
Typography.displayName = "Typography"
