"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { type ReactNode, useCallback, useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import { DataConnectionStatusBadge } from "@/features/data-connections/components/data-connection-status-badge"
import { useDataConnection } from "@/features/data-connections/hooks/use-data-connection"
import { useDataConnections } from "@/features/data-connections/hooks/use-data-connections"
import { useDataProvider } from "@/features/data-connections/hooks/use-data-provider"
import type { DataConnection } from "@/features/data-connections/types"
import { getVeridaVaultDataConnectionPageUrl } from "@/features/verida-vault/utils"

export interface DataConnectionsGlobalStatusPopoverProps {
  children?: ReactNode
}

export function DataConnectionsGlobalStatusPopover(
  props: DataConnectionsGlobalStatusPopoverProps
) {
  const { children } = props

  const { connections } = useDataConnections()

  return (
    <Popover>
      {children}
      <PopoverContent
        align="start"
        alignOffset={-20}
        collisionPadding={8}
        className="w-[calc(100vw-1rem)] max-w-sm"
      >
        {connections && connections.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2 text-muted-foreground">
              <Typography variant="base-s-regular">
                Your data connections
              </Typography>
              <Typography variant="base-s-regular">Status</Typography>
            </div>
            <ul className="flex flex-col gap-2">
              {connections.map((connection) => (
                <li key={connection._id}>
                  <DataConnectionsGlobalStatusPopoverItem
                    connection={connection}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <Typography variant="base-regular">
              No data connections available
            </Typography>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
DataConnectionsGlobalStatusPopover.displayName =
  "DataConnectionsGlobalStatusPopover"

export const DataConnectionsGlobalStatusPopoverTrigger = PopoverTrigger

interface DataConnectionsGlobalStatusPopoverItemProps {
  connection: DataConnection
}

function DataConnectionsGlobalStatusPopoverItem(
  props: DataConnectionsGlobalStatusPopoverItemProps
) {
  const { connection } = props

  const { latestSync } = useDataConnection(connection._id)
  const { provider } = useDataProvider(connection.providerId)

  const [formattedLatestSync, setFormattedLatestSync] = useState<string>("")

  const updateFormattedLatestSync = useCallback(() => {
    if (latestSync) {
      setFormattedLatestSync(
        formatDistanceToNow(latestSync, { addSuffix: true })
      )
    }
  }, [latestSync])

  useEffect(() => {
    updateFormattedLatestSync()
    const intervalId = setInterval(updateFormattedLatestSync, 60000) // Update every minute
    return () => clearInterval(intervalId)
  }, [updateFormattedLatestSync])

  if (connection) {
    return (
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-row items-center gap-1">
          <Avatar className="size-5">
            <AvatarImage src={provider?.icon} alt={provider?.label} />
            <AvatarFallback>
              {provider?.label?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={getVeridaVaultDataConnectionPageUrl(connection._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <Typography className="truncate">
              {connection.profile.readableId}
            </Typography>
          </Link>
        </div>
        <div className="shrink-0">
          {connection.syncStatus === "connected" ? (
            <div className="text-muted-foreground">
              <Typography variant="base-s-regular" className="leading-7">
                {`Synced ${formattedLatestSync || "unknown"}`}
              </Typography>
            </div>
          ) : (
            <DataConnectionStatusBadge status={connection.syncStatus} />
          )}
        </div>
      </div>
    )
  }

  return null
}
DataConnectionsGlobalStatusPopoverItem.displayName =
  "DataConnectionsGlobalStatusPopoverItem"
