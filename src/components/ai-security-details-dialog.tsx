import { BrainCircuitIcon, DatabaseIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"

import {
  SecurityDetailsDialog,
  SecurityDetailsDialogBody,
  SecurityDetailsDialogContent,
  SecurityDetailsDialogDescription,
  SecurityDetailsDialogFooter,
  SecurityDetailsDialogHeader,
  SecurityDetailsDialogTitle,
  SecurityDetailsDialogTrigger,
  SecurityIcon,
} from "@/components/ui/security"
import { Typography } from "@/components/ui/typography"

export interface AiSecurityDetailsDialogProps
  extends ComponentProps<typeof SecurityDetailsDialogTrigger> {}

export function AiSecurityDetailsDialog(props: AiSecurityDetailsDialogProps) {
  const { ...triggerProps } = props

  return (
    <SecurityDetailsDialog>
      <SecurityDetailsDialogTrigger variant="warning" {...triggerProps} />
      <SecurityDetailsDialogContent>
        <SecurityDetailsDialogHeader>
          <div className="flex min-w-0 flex-row items-center gap-2">
            <SecurityIcon className="size-5 text-status-warning" />
            <SecurityDetailsDialogTitle className="flex-1 text-foreground">
              Privacy notice
            </SecurityDetailsDialogTitle>
          </div>
          <SecurityDetailsDialogDescription>
            We are actively building Verida Confidential Compute focused on
            security and privacy.
          </SecurityDetailsDialogDescription>
          <SecurityDetailsDialogDescription>
            During the{" "}
            <Typography variant="base-semibold" component="span">
              Alpha phase
            </Typography>
            , temporary solutions have been implemented for the AI processing
            using a third party platform. While not perfect, these solutions
            provide adequate protections for your data.
          </SecurityDetailsDialogDescription>
        </SecurityDetailsDialogHeader>
        <SecurityDetailsDialogBody className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <BrainCircuitIcon className="size-4 shrink-0 text-status-warning" />
            <div className="flex flex-col gap-1">
              <Typography
                variant="heading-5"
                component="p"
                className="leading-5 sm:leading-5"
              >
                AI Processing
              </Typography>
              <div className="text-muted-foreground">
                <Typography variant="base-regular">
                  Your requests are sent to a third-party platform. Your inputs
                  and the AI outputs are{" "}
                  <Typography variant="base-semibold" component="span">
                    not
                  </Typography>{" "}
                  stored.
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DatabaseIcon className="size-4 shrink-0 text-status-warning" />
            <div className="flex flex-col gap-1">
              <Typography
                variant="heading-5"
                component="p"
                className="leading-5 sm:leading-5"
              >
                Data access
              </Typography>
              <div className="text-muted-foreground">
                <Typography variant="base-regular">
                  A subset of your data is sent to the third-party platform as
                  part of your requests. They are similarly{" "}
                  <Typography variant="base-semibold" component="span">
                    not
                  </Typography>{" "}
                  stored.
                </Typography>
              </div>
            </div>
          </div>
        </SecurityDetailsDialogBody>
        <SecurityDetailsDialogFooter>
          <Link
            href="https://docs.verida.ai/resources/privacy-and-security#llm-privacy-beta"
            target="_blank"
            className="text-muted-foreground underline"
          >
            <Typography variant="base-regular">
              Learn more about the AI privacy and security
            </Typography>
          </Link>
        </SecurityDetailsDialogFooter>
      </SecurityDetailsDialogContent>
    </SecurityDetailsDialog>
  )
}
AiSecurityDetailsDialog.displayName = "AiSecurityDetailsDialog"
