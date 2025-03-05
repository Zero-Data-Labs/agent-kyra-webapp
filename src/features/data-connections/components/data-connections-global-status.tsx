"use client"

import { formatDistanceToNow } from "date-fns"
import { InfoIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import {
  DataConnectionsGlobalStatusPopover,
  DataConnectionsGlobalStatusPopoverTrigger,
} from "@/features/data-connections/components/data-connections-global-status-popover"
import { useDataConnections } from "@/features/data-connections/hooks/use-data-connections"
import { cn } from "@/styles/utils"

export type DataConnectionsGlobalStatusProps = Omit<
  React.ComponentProps<"div">,
  "children"
>

export function DataConnectionsGlobalStatus(
  props: DataConnectionsGlobalStatusProps
) {
  const { className, ...divProps } = props

  const { connections, isAnySyncing, latestSync } = useDataConnections()

  const [formattedLatestSync, setFormattedLatestSync] = useState<string>("")

  const updateFormattedLatestSync = useCallback(() => {
    if (latestSync) {
      setFormattedLatestSync(
        // TODO: If relevant, use the functions in utils instead of date-fns
        formatDistanceToNow(latestSync, { addSuffix: true })
      )
    }
  }, [latestSync])

  useEffect(() => {
    updateFormattedLatestSync()
    const intervalId = setInterval(updateFormattedLatestSync, 60000) // Update every minute
    return () => clearInterval(intervalId)
  }, [updateFormattedLatestSync])

  const statusMessage = useMemo(() => {
    if (isAnySyncing) {
      return "Data currently syncing..."
    }

    if (connections === undefined) {
      return "Checking data connections..."
    }

    if (connections.length === 0) {
      return "No data connections"
    }

    if (!latestSync) {
      return "Data connections not synced"
    }

    return `Data synced ${formattedLatestSync}`
  }, [isAnySyncing, connections, latestSync, formattedLatestSync])

  return (
    <div
      {...divProps}
      className={cn(
        "flex flex-row items-center gap-2 text-muted-foreground",
        className
      )}
    >
      <DataConnectionsGlobalStatusPopover>
        <DataConnectionsGlobalStatusPopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 rounded-full p-0"
          >
            <InfoIcon className="size-5 shrink-0 text-muted-foreground" />
            <span className="sr-only">Show data connections status</span>
          </Button>
        </DataConnectionsGlobalStatusPopoverTrigger>
      </DataConnectionsGlobalStatusPopover>
      <Typography variant="base-s-regular">{statusMessage}</Typography>
    </div>
  )
}
DataConnectionsGlobalStatus.displayName = "DataConnectionsGlobalStatus"
