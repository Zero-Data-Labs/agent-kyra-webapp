"use client"

import { useCallback } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { useToast } from "@/features/toasts/use-toast"

export type AssistantOutputCardMenuProps = {
  children: React.ReactNode
}

export function AssistantOutputCardMenu(props: AssistantOutputCardMenuProps) {
  const { children } = props

  const { toast } = useToast()

  const { agentOutput, clearAgentOutput } = useAgentChat()

  const handleCopyAssistantOutput = useCallback(async () => {
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
          onClick={handleCopyAssistantOutput}
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
AssistantOutputCardMenu.displayName = "AssistantOutputCardMenu"
