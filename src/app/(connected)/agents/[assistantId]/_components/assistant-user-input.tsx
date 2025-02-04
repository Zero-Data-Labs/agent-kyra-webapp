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

import { AiPromptsCombobox } from "@/app/(connected)/agents/[assistantId]/_components/ai-prompts-combobox"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MAX_NB_PROMPTS_PER_ASSISTANT } from "@/features/assistants/constants"
import { useAiPromptDialog } from "@/features/assistants/hooks/use-ai-prompt-dialog"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { useGetAiPrompts } from "@/features/assistants/hooks/use-get-ai-prompts"
import { cn, getMediaQuery } from "@/styles/utils"

export type AssistantUserInputProps = Omit<
  React.ComponentProps<"div">,
  "children"
>

export function AssistantUserInput(props: AssistantUserInputProps) {
  const { ...divProps } = props

  const {
    selectedAiAssistant,
    aiPromptInput,
    aiAssistantOutput,
    processAiPromptInput,
    updateAiPromptInput,
    clearAiPromptInput,
  } = useAssistants()

  const { openSaveDialog } = useAiPromptDialog()
  const { aiPrompts } = useGetAiPrompts({
    filter: {
      assistantId: selectedAiAssistant,
    },
  })
  // const { openDialog: openConfigDialog } = useAiPromptConfigDialog()

  const isMaxNbPromptsReached = useMemo(
    () =>
      aiPrompts ? aiPrompts.length >= MAX_NB_PROMPTS_PER_ASSISTANT : false,
    [aiPrompts]
  )

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleUserPromptChange: ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event) => {
        updateAiPromptInput((prevInput) => ({
          ...prevInput,
          prompt: event.target.value,
        }))
      },
      [updateAiPromptInput]
    )

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        processAiPromptInput()
      }
    },
    [processAiPromptInput]
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
            value={aiPromptInput?.prompt ?? ""}
            onChange={handleUserPromptChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "max-h-32 rounded-none border-none py-1 pl-0 focus-visible:ring-0",
              aiPromptInput?.prompt ? "pr-8 sm:pr-10" : "pr-1"
            )}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            endAdornmentContainerClassName="top-0 pt-1 pr-1.5 sm:pr-2.5 flex flex-row gap-1"
            endAdornment={
              aiPromptInput?.prompt ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={clearAiPromptInput}
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
              <AiPromptsCombobox
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
                  disabled={!aiPromptInput?.prompt || isMaxNbPromptsReached}
                  onClick={() => {
                    openSaveDialog({
                      prompt: aiPromptInput?.prompt,
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
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 sm:size-10"
                  onClick={openConfigDialog}
                >
                  <Settings2Icon className="size-5 sm:size-6" />
                  <span className="sr-only">Manage prompt configurations</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configure</TooltipContent>
            </Tooltip> */}
            <Button
              variant="primary"
              size="icon"
              className="size-8 sm:size-10"
              onClick={processAiPromptInput}
              disabled={
                !aiPromptInput?.prompt ||
                aiAssistantOutput?.status === "processing"
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
AssistantUserInput.displayName = "AssistantUserInput"
