import { RootAuthenticationHandler } from "@/features/auth/components/root-authentication-handler"
import { ConnectionPageContent } from "@/features/connection-page/components/connection-page-content"

export default function RootPage() {
  return (
    <RootAuthenticationHandler>
      <ConnectionPageContent className="h-dvh" />
    </RootAuthenticationHandler>
  )
}
RootPage.displayName = "RootPage"
