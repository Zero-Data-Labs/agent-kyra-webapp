import type { Metadata, Viewport } from "next"

import { RootProviders } from "@/components/root-providers"
import { commonConfig } from "@/config/common"
import { APP_DESCRIPTION, APP_NAME, APP_TITLE } from "@/constants/app"
import { sora } from "@/styles/fonts"
import "@/styles/globals.css"
import { cn } from "@/styles/utils"

const baseUrl = new URL(commonConfig.BASE_URL)

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  metadataBase: baseUrl,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: baseUrl,
    // images: {
    //   url: `${baseUrl.toString()}images/social_preview.png`,
    //   width: 1200,
    //   height: 630,
    //   alt: APP_NAME,
    // },
    siteName: APP_NAME,
    type: "website",
  },
}

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
  themeColor: "#FFFFFF",
}

export interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("h-dvh", sora.variable)}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
RootLayout.displayName = "RootLayout"
