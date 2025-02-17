"use client"

import {
  ChevronDownIcon,
  CopyIcon,
  LogOutIcon,
  MessageCircle,
} from "lucide-react"
import React, { useCallback } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { version } from "@/config/version"
import { APP_NAME } from "@/constants/app"
import { useUserFeedback } from "@/features/telemetry/use-user-feedback"
import { useToast } from "@/features/toasts/use-toast"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"
import { ProfileAvatar } from "@/features/verida-profile/components/profile-avatar"
import { EMPTY_PROFILE_NAME_FALLBACK } from "@/features/verida-profile/constants"
import { useUserProfile } from "@/features/verida-profile/hooks/use-user-profile"
import { cn } from "@/styles/utils"

export interface IdentityDropdownMenuProps
  extends Pick<React.ComponentProps<typeof Button>, "className"> {}

export function IdentityDropdownMenu(props: IdentityDropdownMenuProps) {
  const { className } = props

  const { disconnect } = useVeridaAuth()
  const { did, profile, isLoading: isLoadingProfile } = useUserProfile()

  const { openForm: openUserFeedbackForm, isReady: isUserFeedbackReady } =
    useUserFeedback()

  const { toast } = useToast()

  const handleCopyDid = useCallback(async () => {
    if (did) {
      await window.navigator.clipboard.writeText(did)
      toast({
        variant: "success",
        description: "DID copied to clipboard",
      })
    }
  }, [did, toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-auto max-w-56 rounded-full border-0 p-0 md:rounded-lg md:border md:py-2 md:pl-3 md:pr-2",
            className
          )}
        >
          <div className="flex w-full flex-row items-center gap-2">
            <ProfileAvatar
              profile={profile}
              isLoading={isLoadingProfile}
              className="size-8"
            />
            {profile ? (
              <p
                className={cn(
                  "hidden flex-1 truncate text-base font-semibold leading-5 text-muted-foreground md:block",
                  profile.name ? "" : "italic"
                )}
              >
                {profile.name || EMPTY_PROFILE_NAME_FALLBACK}
              </p>
            ) : (
              <Skeleton className="my-0.5 hidden h-4 w-24 md:block" />
            )}
            <ChevronDownIcon className="hidden size-5 shrink-0 text-muted-foreground md:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-screen max-w-80 rounded-xl p-0 text-muted-foreground"
        align="end"
      >
        <DropdownMenuItem className="block px-4 py-3" onClick={handleCopyDid}>
          <div className="flex flex-row items-center gap-3">
            <ProfileAvatar
              profile={profile}
              isLoading={isLoadingProfile}
              className="size-12"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {profile ? (
                <p
                  className={cn(
                    "truncate text-base font-semibold leading-snug",
                    profile.name ? "" : "italic"
                  )}
                >
                  {profile.name || EMPTY_PROFILE_NAME_FALLBACK}
                </p>
              ) : (
                <Skeleton className="h-4 w-full" />
              )}
              {did ? (
                <div className="text-muted-foreground">
                  <Typography
                    variant="base-s-regular"
                    className="truncate leading-normal"
                  >
                    {did}
                  </Typography>
                </div>
              ) : (
                <Skeleton className="my-0.5 h-3 w-12" />
              )}
            </div>
            {did ? (
              <div className="-mx-2 flex cursor-pointer flex-row items-center justify-center rounded-md p-2">
                <CopyIcon className="size-5" />
                <span className="sr-only">Click to copy DID</span>
              </div>
            ) : null}
          </div>
        </DropdownMenuItem>
        {isUserFeedbackReady ? (
          <DropdownMenuItem
            onClick={openUserFeedbackForm}
            className="cursor-pointer gap-3 px-4 py-4 text-muted-foreground"
          >
            <MessageCircle />
            <Typography variant="base-semibold">Give your feedback</Typography>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer gap-3 px-4 py-4 text-destructive"
        >
          <LogOutIcon />
          <Typography variant="base-semibold">Disconnect</Typography>
        </DropdownMenuItem>
        <DropdownMenuLabel className="text-center text-xs font-normal">
          {`${APP_NAME} ${version}`}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
IdentityDropdownMenu.displayName = "IdentityDropdownMenu"
