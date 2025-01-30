import { cn } from "@/styles/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface-active animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
