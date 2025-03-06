import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { cn } from "@/styles/utils"

export interface FeatureCardProps
  extends Omit<ComponentProps<typeof Card>, "children"> {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard(props: FeatureCardProps) {
  const { className, icon: Icon, title, description, ...cardProps } = props

  return (
    <Card
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      {...cardProps}
    >
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="size-6 text-primary" />
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  )
}
FeatureCard.displayName = "FeatureCard"
