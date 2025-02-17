import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EMPTY_VALUE_FALLBACK } from "@/constants/misc"
import type { VeridaProfile } from "@/features/verida-profile/types"
import { cn } from "@/styles/utils"

export interface ProfileAvatarProps
  extends Omit<React.ComponentProps<typeof Avatar>, "children"> {
  profile: VeridaProfile | undefined | null
  isLoading?: boolean
}

export function ProfileAvatar(props: ProfileAvatarProps) {
  const { profile, isLoading, className, ...avatarProps } = props

  return (
    <Avatar className={cn("size-10", className)} {...avatarProps}>
      {profile ? (
        <>
          <AvatarImage alt="Avatar" src={profile.avatar?.uri} />
          <AvatarFallback>
            {profile.name?.at(0)?.toUpperCase() || EMPTY_VALUE_FALLBACK}
          </AvatarFallback>
        </>
      ) : isLoading ? (
        <Skeleton className="h-full w-full rounded-full" />
      ) : (
        <AvatarFallback>{EMPTY_VALUE_FALLBACK}</AvatarFallback>
      )}
    </Avatar>
  )
}
ProfileAvatar.displayName = "ProfileAvatar"
