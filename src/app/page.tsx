import { Typography } from "@/components/ui/typography"
import { VeridaConnectButton } from "@/features/verida-auth/components/verida-connect-button"

export default function RootPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Typography variant="heading-1">
        Landing page when not connected
      </Typography>
      <VeridaConnectButton />
    </div>
  )
}
RootPage.displayName = "RootPage"
