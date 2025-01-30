"use client"

import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
} from "lucide-react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/features/toasts/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-row items-center gap-3">
              {variant === "info" ? (
                <InfoIcon className="size-6 shrink-0 self-start" />
              ) : null}
              {variant === "success" ? (
                <CircleCheckIcon className="size-6 shrink-0 self-start" />
              ) : null}
              {variant === "warning" ? (
                <CircleAlertIcon className="size-6 shrink-0 self-start" />
              ) : null}
              {variant === "error" ? (
                <CircleXIcon className="size-6 shrink-0 self-start" />
              ) : null}
              <div className="flex flex-1 flex-col gap-1">
                {title ? <ToastTitle>{title}</ToastTitle> : null}
                {description ? (
                  <ToastDescription>{description}</ToastDescription>
                ) : null}
              </div>
              {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
