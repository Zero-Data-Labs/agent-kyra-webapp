"use client"

import {
  ErrorPageContent,
  type ErrorPageProps,
} from "@/components/error-page-content"

export default function RootErrorPage(props: ErrorPageProps) {
  const { error, reset } = props

  return <ErrorPageContent error={error} reset={reset} hideNavigationButton />
}
RootErrorPage.displayName = "RootErrorPage"
