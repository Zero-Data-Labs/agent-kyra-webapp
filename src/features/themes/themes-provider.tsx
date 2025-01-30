"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemesProviderProps = {
  children: React.ReactNode
}

export function ThemesProvider(props: ThemesProviderProps) {
  const { children } = props

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
