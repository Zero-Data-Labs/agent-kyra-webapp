"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemesProvider } from "@/features/themes/themes-provider"

export interface RootProvidersProps {
  children: React.ReactNode
}

export function RootProviders(props: RootProvidersProps) {
  const { children } = props

  // Put global providers not requiring the user to be connected or authorised to use the app.
  // For providers requiring the user to be connected and/or authorised to use the app, use the AppRestrictedProviders or AppUnrestrictedProviders components instead.
  return (
    <Suspense>
      <NuqsAdapter>
        <ThemesProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemesProvider>
      </NuqsAdapter>
    </Suspense>
  )
}
RootProviders.displayName = "RootProviders"
