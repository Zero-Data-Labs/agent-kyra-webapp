"use client"

import { useCallback } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { useToast } from "@/features/toasts/use-toast"

export type AssistantOutputCardMenuProps = {
  children: React.ReactNode
}

export function AssistantOutputCardMenu(props: AssistantOutputCardMenuProps) {
  const { children } = props

  const { toast } = useToast()

  const { aiAssistantOutput, clearAiAssistantOutput } = useAssistants()

  const handleCopyAssistantOutput = useCallback(async () => {
    if (aiAssistantOutput?.status === "processed") {
      await window.navigator.clipboard.writeText(aiAssistantOutput.result)
      toast({
        variant: "success",
        description: "Agent response copied to clipboard",
      })
    }
  }, [aiAssistantOutput, toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" collisionPadding={8}>
        <DropdownMenuItem
          onClick={handleCopyAssistantOutput}
          disabled={aiAssistantOutput?.status !== "processed"}
        >
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={clearAiAssistantOutput}
          className="text-destructive"
        >
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
AssistantOutputCardMenu.displayName = "AssistantOutputCardMenu"
