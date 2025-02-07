import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

export interface ThemesProviderProps {
  children: ReactNode
}

export function ThemesProvider(props: ThemesProviderProps) {
  const { children } = props

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
ThemesProvider.displayName = "ThemesProvider"
