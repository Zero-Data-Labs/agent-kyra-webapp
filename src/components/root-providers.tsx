"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { QueriesProvider } from "@/features/queries/queries-provider"
import { ThemesProvider } from "@/features/themes/themes-provider"
import { Toaster } from "@/features/toasts/toaster"
import { VeridaAuthProvider } from "@/features/verida-auth/components/verida-auth-provider"

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
          <TooltipProvider>
            <QueriesProvider>
              <VeridaAuthProvider>{children}</VeridaAuthProvider>
            </QueriesProvider>
            <Toaster />
          </TooltipProvider>
        </ThemesProvider>
      </NuqsAdapter>
    </Suspense>
  )
}
RootProviders.displayName = "RootProviders"
