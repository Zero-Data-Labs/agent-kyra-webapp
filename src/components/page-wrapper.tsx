import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

export interface PageWrapperProps extends ComponentProps<"div"> {
  pageTitle?: string | ReactNode
  rightContent?: ReactNode
  backNavigationHref?: string
  backNavigationLabel?: string
  children: ReactNode
  contentClassName?: ComponentProps<"div">["className"]
}

export function PageWrapper(props: PageWrapperProps) {
  const {
    pageTitle,
    rightContent,
    backNavigationHref,
    backNavigationLabel,
    children,
    className,
    contentClassName,
    ...divProps
  } = props

  return (
    <div
      className={cn("flex min-h-full flex-1 flex-col gap-6", className)}
      {...divProps}
    >
      <div className="flex flex-col gap-9">
        {backNavigationHref ? (
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="-mx-2 -my-2 h-auto w-auto p-2"
            >
              <Link href={backNavigationHref}>
                <ArrowLeftIcon />
              </Link>
            </Button>
            {backNavigationLabel ? (
              <Typography variant="heading-5" component="span">
                {backNavigationLabel}
              </Typography>
            ) : null}
          </div>
        ) : null}
        {pageTitle || rightContent ? (
          <div className="flex min-h-12 w-full flex-row items-center justify-between gap-6">
            {typeof pageTitle === "string" ? (
              <PageTitle>{pageTitle}</PageTitle>
            ) : (
              pageTitle
            )}
            {rightContent}
          </div>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col pb-4 md:pb-6 xl:pb-8",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
PageWrapper.displayName = "PageWrapper"

export interface PageTitleProps extends ComponentProps<typeof Typography> {}

export function PageTitle(props: PageTitleProps) {
  const { variant = "heading-3", ...typographyProps } = props

  return <Typography variant={variant} {...typographyProps} />
}
PageTitle.displayName = "PageTitle"
