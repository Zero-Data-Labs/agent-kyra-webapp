import { RootAuthenticationHandler } from "@/features/auth/components/root-authentication-handler"
import { LandingPageContent } from "@/features/landing-page/components/landing-page-content"

export default function RootPage() {
  return (
    <RootAuthenticationHandler>
      <LandingPageContent className="h-dvh" />
    </RootAuthenticationHandler>
  )
}
RootPage.displayName = "RootPage"
