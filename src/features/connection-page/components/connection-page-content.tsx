import { BrainCircuitIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Typography } from "@/components/ui/typography"
import { ConnectButton } from "@/features/auth/components/connect-button"
import { FeatureCard } from "@/features/connection-page/components/feature-card"
import { cn } from "@/styles/utils"

export interface ConnectionPageContentProps
  extends Omit<ComponentProps<"div">, "children"> {}

export function ConnectionPageContent(props: ConnectionPageContentProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center gap-8 p-6",
        className
      )}
      {...divProps}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Typography variant="heading-1">Agent Kyra</Typography>
        <div className="max-w-xl text-muted-foreground">
          <Typography variant="base-regular">
            Your AI-powered personal productivity assistant that helps you
            analyze your emails, calendar, and personal data to achieve your
            goals efficiently.
          </Typography>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <ConnectButton />
      </div>
      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-3">
        <FeatureCard
          icon={ShieldCheckIcon}
          title="Secure Data Access"
          description="Connect securely through Verida Network to give Agent Kyra access to your personal data while maintaining full control."
        />
        <FeatureCard
          icon={SparklesIcon}
          title="Personalized Experience"
          description="Agent Kyra uses your data to provide personalized insights and recommendations tailored to your needs."
        />
        <FeatureCard
          icon={BrainCircuitIcon}
          title="Smart Analysis"
          description="Get intelligent analysis of your emails, calendar, and personal data to help you make better decisions."
        />
      </div>
    </div>
  )
}
ConnectionPageContent.displayName = "ConnectionPageContent"
