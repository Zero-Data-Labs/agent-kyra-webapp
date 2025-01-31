"use client"

export type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders(props: AppProvidersProps) {
  const { children } = props

  // Put the providers requiring the user to be authenticated to the app. This should be most providers with any feature-related logic

  // For global providers required in any cases, use the RootProviders component.
  return <>{children}</>
}
AppProviders.displayName = "AppProviders"
