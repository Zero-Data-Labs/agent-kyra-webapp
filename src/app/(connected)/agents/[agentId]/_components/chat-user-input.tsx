"use client"

import { BookmarkIcon, SendIcon, XIcon } from "lucide-react"
import React, {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import { useMediaQuery } from "usehooks-ts"

import { PromptsCombobox } from "@/app/(connected)/agents/[agentId]/_components/prompts-combobox"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import { MAX_NB_SAVED_PROMPTS_PER_AGENT } from "@/features/saved-prompts/constants"
import { useGetSavedPrompts } from "@/features/saved-prompts/hooks/use-get-saved-prompts"
import { useSavedPromptDialog } from "@/features/saved-prompts/hooks/use-saved-prompt-dialog"
import { cn, getMediaQuery } from "@/styles/utils"

export type ChatUserInputProps = Omit<React.ComponentProps<"div">, "children">

export function ChatUserInput(props: ChatUserInputProps) {
  const { ...divProps } = props

  const {
    selectedAgent,
    promptInput,
    agentOutput,
    processPromptInput,
    updatePromptInput,
    clearPromptInput,
  } = useAgentChat()

  const { openSaveDialog } = useSavedPromptDialog()
  const { savedPrompts } = useGetSavedPrompts({
    filter: {
      assistantId: selectedAgent,
    },
  })

  const isMaxNbPromptsReached = useMemo(
    () =>
      savedPrompts
        ? savedPrompts.length >= MAX_NB_SAVED_PROMPTS_PER_AGENT
        : false,
    [savedPrompts]
  )

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleUserPromptChange: ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event) => {
        updatePromptInput((prevInput) => ({
          ...prevInput,
          prompt: event.target.value,
        }))
      },
      [updatePromptInput]
    )

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        processPromptInput()
      }
    },
    [processPromptInput]
  )

  useLayoutEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSetPrompt = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const isXL = useMediaQuery(getMediaQuery("xl"))

  return (
    <div {...divProps}>
      <Card className="gap-1 rounded-xl p-3 shadow-md ring-offset-surface focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 hover:border-border-hover md:gap-2 md:p-4">
        <CardBody>
          <Textarea
            ref={inputRef}
            placeholder="Ask your agent"
            value={promptInput?.prompt ?? ""}
            onChange={handleUserPromptChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "max-h-32 rounded-none border-none py-1 pl-0 focus-visible:ring-0",
              promptInput?.prompt ? "pr-8 sm:pr-10" : "pr-1"
            )}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            endAdornmentContainerClassName="top-0 pt-1 pr-1.5 sm:pr-2.5 flex flex-row gap-1"
            endAdornment={
              promptInput?.prompt ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={clearPromptInput}
                >
                  <XIcon className="size-5 opacity-50 sm:size-6" />
                  <span className="sr-only">Clear user input</span>
                </Button>
              ) : null
            }
          />
        </CardBody>
        <CardFooter className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-2">
            {!isXL ? (
              <PromptsCombobox
                onSetPrompt={handleSetPrompt}
                className="size-8 sm:size-10"
              />
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 sm:size-10"
                  disabled={!promptInput?.prompt || isMaxNbPromptsReached}
                  onClick={() => {
                    openSaveDialog({
                      prompt: promptInput?.prompt,
                    })
                  }}
                >
                  <BookmarkIcon className="size-5 sm:size-6" />
                  <span className="sr-only">Save this prompt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isMaxNbPromptsReached
                  ? "Maximum number of saved prompts reached"
                  : "Save this prompt"}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              variant="primary"
              size="icon"
              className="size-8 sm:size-10"
              onClick={processPromptInput}
              disabled={
                !promptInput?.prompt || agentOutput?.status === "processing"
              }
            >
              <SendIcon className="size-5 sm:size-6" />
              <span className="sr-only">Send to agent for processing</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
ChatUserInput.displayName = "ChatUserInput"
