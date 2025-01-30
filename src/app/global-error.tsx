"use client"

import {
  ErrorPageContent,
  type ErrorPageProps,
} from "@/components/error-page-content"
import { sora } from "@/styles/fonts"
import { cn } from "@/styles/utils"

export default function GlobalErrorPage(props: ErrorPageProps) {
  const { error, reset } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("h-dvh", sora.variable)}>
        <ErrorPageContent error={error} reset={reset} hideNavigationButton />
      </body>
    </html>
  )
}
GlobalErrorPage.displayName = "GlobalErrorPage"
