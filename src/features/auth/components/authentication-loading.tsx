import type { ComponentProps } from "react"

import {
  LoadingBlock,
  LoadingBlockDescription,
  LoadingBlockSpinner,
  LoadingBlockTitle,
} from "@/components/ui/loading"
import { cn } from "@/styles/utils"

export interface AuthenticationLoadingProps
  extends Omit<ComponentProps<typeof LoadingBlock>, "children"> {}

export function AuthenticationLoading(props: AuthenticationLoadingProps) {
  const { className, ...loadingBlockProps } = props

  return (
    <LoadingBlock className={cn(className)} {...loadingBlockProps}>
      <LoadingBlockSpinner />
      <LoadingBlockTitle variant="heading-1">Connecting...</LoadingBlockTitle>
      <LoadingBlockDescription variant="base-l">
        Please wait while we establish a secure connection. This might take a
        moment.
      </LoadingBlockDescription>
    </LoadingBlock>
  )
}
AuthenticationLoading.displayName = "AuthenticationLoading"
