"use client"

import { ChevronDownIcon } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import { AgentSelector } from "@/app/(connected)/agents/[agentId]/_components/agent-selector"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import { DEFAULT_AGENT } from "@/features/saved-agents/constants"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { cn } from "@/styles/utils"

export interface AgentComboboxProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  agentId: string
}

export function AgentCombobox(props: AgentComboboxProps) {
  const { agentId, className, ...buttonProps } = props

  const [open, setOpen] = useState(false)

  const { savedAgents } = useGetSavedAgents()

  const currentAgent = useMemo(() => {
    return (
      savedAgents?.find((savedAgent) => savedAgent._id === agentId) ??
      (agentId === DEFAULT_AGENT._id ? DEFAULT_AGENT : null)
    )
  }, [savedAgents, agentId])

  const handleAction = useCallback(async () => {
    setOpen(false)
  }, [])

  if (!currentAgent) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          {...buttonProps}
          className={cn(
            "min-w-0 gap-2 bg-transparent px-2",
            currentAgent ? "text-foreground" : "text-muted-foreground",
            className
          )}
          aria-expanded={open}
        >
          {currentAgent ? (
            <Typography variant="heading-3" className="truncate">
              {currentAgent.name}
            </Typography>
          ) : (
            <Typography variant="heading-5" className="truncate italic">
              Choose Agent
            </Typography>
          )}
          <ChevronDownIcon className="size-5 shrink-0 text-muted-foreground" />
          <span className="sr-only">Select AI Agent</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        alignOffset={-20}
        collisionPadding={8}
        className="w-[calc(100vw-1rem)] max-w-sm rounded-[0.875rem] p-0"
      >
        <AgentSelector
          currentAgentId={agentId}
          onCreateClick={handleAction}
          onItemSelect={handleAction}
          onEditClick={handleAction}
        />
      </PopoverContent>
    </Popover>
  )
}
AgentCombobox.displayName = "AgentCombobox"
