"use client"

import { type ReactNode, useCallback } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { useToast } from "@/features/toasts/use-toast"

export interface ChatAgentOutputCardMenuProps {
  children: ReactNode
}

export function ChatAgentOutputCardMenu(props: ChatAgentOutputCardMenuProps) {
  const { children } = props

  const { toast } = useToast()

  const { agentOutput, clearAgentOutput } = useAgentChat()

  const handleCopyOutput = useCallback(async () => {
    if (agentOutput?.status === "processed") {
      await window.navigator.clipboard.writeText(agentOutput.result)
      toast({
        variant: "success",
        description: "Agent response copied to clipboard",
      })
    }
  }, [agentOutput, toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" collisionPadding={8}>
        <DropdownMenuItem
          onClick={handleCopyOutput}
          disabled={agentOutput?.status !== "processed"}
        >
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={clearAgentOutput}
          className="text-destructive"
        >
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
ChatAgentOutputCardMenu.displayName = "ChatAgentOutputCardMenu"
