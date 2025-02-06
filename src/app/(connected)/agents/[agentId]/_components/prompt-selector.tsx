"use client"

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowUpRightIcon, GripVerticalIcon, PencilIcon } from "lucide-react"
import { useCallback, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { useAgentChat } from "@/features/agent-chat/hooks/use-agent-chat"
import type { PromptInput } from "@/features/agent-chat/types"
import { DEFAULT_SAVED_PROMPT_ORDER } from "@/features/saved-prompts/constants"
import { useGetSavedPrompts } from "@/features/saved-prompts/hooks/use-get-saved-prompts"
import { useSavedPromptDialog } from "@/features/saved-prompts/hooks/use-saved-prompt-dialog"
import { useUpdateSavedPrompt } from "@/features/saved-prompts/hooks/use-update-saved-prompt"
import type { SavedPromptRecord } from "@/features/saved-prompts/types"
import { SUGGESTED_PROMPTS } from "@/features/suggested-prompts/constants"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"
import { moveItemInArray } from "@/utils/misc"

const logger = Logger.create("agent-page")

export interface PromptSelectorProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  onSelect?: () => void
  onSetPrompt?: () => void
}

export function PromptSelector(props: PromptSelectorProps) {
  const { className, onSelect, onSetPrompt, ...divProps } = props

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const {
    selectedAgent,
    setAndProcessPromptInput,
    updatePromptInput,
    promptSearchValue,
    setPromptSearchValue,
  } = useAgentChat()

  const { openEditDialog } = useSavedPromptDialog()

  // TODO: Handle pagination, filter and sort. Link this to the value in the
  // CommandInput and turn the whole Command to a controlled component
  const { savedPrompts } = useGetSavedPrompts({
    filter: {
      assistantId: selectedAgent,
    },
  })
  const { updateSavedPromptAsync } = useUpdateSavedPrompt()

  const handleSelect = useCallback(
    async (input: PromptInput) => {
      setAndProcessPromptInput(input)
      onSelect?.()
    },
    [setAndProcessPromptInput, onSelect]
  )

  const handleSetPrompt = useCallback(
    async (input: PromptInput) => {
      updatePromptInput(input)
      onSetPrompt?.()
    },
    [updatePromptInput, onSetPrompt]
  )

  const handleClearSearch = useCallback(() => {
    setPromptSearchValue("")
  }, [setPromptSearchValue])

  const sortedSavedPromptIds = useMemo(() => {
    return savedPrompts
      ? savedPrompts.map((savedPrompt) => ({
          id: savedPrompt._id,
        }))
      : []
  }, [savedPrompts])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      if (!savedPrompts) {
        return
      }

      const { active, over } = event

      if (active.id === over?.id) {
        return
      }

      const oldIndex = savedPrompts.findIndex(
        (savedPrompt) => savedPrompt._id === active.id
      )
      const newIndex = savedPrompts.findIndex(
        (savedPrompt) => savedPrompt._id === over?.id
      )

      const movedSavedPrompt = savedPrompts[oldIndex]
      const newSavedPrompts = moveItemInArray(savedPrompts, oldIndex, newIndex)

      // Get previous and next prompts for order calculation
      const prevPrompt = newIndex > 0 ? newSavedPrompts[newIndex - 1] : null
      const nextPrompt =
        newIndex < newSavedPrompts.length - 1
          ? newSavedPrompts[newIndex + 1]
          : null

      let newOrder: number

      if (prevPrompt?.order !== undefined && nextPrompt?.order !== undefined) {
        // Both neighbors have order - set as average
        newOrder = (prevPrompt.order + nextPrompt.order) / 2
      } else if (prevPrompt?.order !== undefined) {
        // Only previous has order - add DEFAULT_PROMPT_ORDER
        newOrder = prevPrompt.order + DEFAULT_SAVED_PROMPT_ORDER
      } else if (nextPrompt?.order !== undefined) {
        // Only next has order - subtract DEFAULT_PROMPT_ORDER
        newOrder = nextPrompt.order - DEFAULT_SAVED_PROMPT_ORDER
      } else {
        // Neither has order - start at DEFAULT_PROMPT_ORDER * position
        newOrder = (newIndex + 1) * DEFAULT_SAVED_PROMPT_ORDER
      }

      try {
        // Update the moved agent with new order
        await updateSavedPromptAsync({
          ...movedSavedPrompt,
          order: newOrder,
        } as SavedPromptRecord)
      } catch (error) {
        logger.error(
          new Error("Failed to update prompt order", { cause: error })
        )
      }
    },
    [savedPrompts, updateSavedPromptAsync]
  )

  return (
    <div {...divProps} className={cn(className)}>
      <Command loop>
        <div className="p-1">
          <CommandInput
            placeholder="Search..."
            value={promptSearchValue}
            onValueChange={setPromptSearchValue}
            displayClearButton={promptSearchValue.length > 0}
            onClear={handleClearSearch}
          />
        </div>
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {savedPrompts && savedPrompts.length > 0 ? (
            <CommandGroup heading="Saved">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedSavedPromptIds}
                  strategy={verticalListSortingStrategy}
                >
                  {savedPrompts.map((savedPrompt) => (
                    <PromptSelectorItem
                      key={savedPrompt._id}
                      prompt={savedPrompt}
                      sortable={savedPrompts.length > 1}
                      onSelect={() => {
                        handleSelect(savedPrompt)
                      }}
                      onSetPrompt={() => {
                        handleSetPrompt(savedPrompt)
                      }}
                      additionalActions={
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditDialog(savedPrompt)
                                }}
                              >
                                <PencilIcon className="size-4 sm:size-5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </>
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CommandGroup>
          ) : null}
          <CommandGroup heading="Suggested">
            {SUGGESTED_PROMPTS.map((suggestedPrompt, index) => (
              <PromptSelectorItem
                key={index}
                prompt={suggestedPrompt}
                onSelect={() => {
                  handleSelect(suggestedPrompt)
                }}
                onSetPrompt={() => {
                  handleSetPrompt(suggestedPrompt)
                }}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
PromptSelector.displayName = "PromptSelector"

type PromptSelectorItemProps = {
  prompt: SavedPromptRecord
  onSelect: () => void
  onSetPrompt: () => void
  sortable?: boolean
  additionalActions?: React.ReactNode
}

function PromptSelectorItem(props: PromptSelectorItemProps) {
  const { prompt, onSelect, onSetPrompt, sortable, additionalActions } = props

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: prompt._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <CommandItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      value={prompt.prompt}
      onSelect={onSelect}
      className="cursor-pointer py-1 pl-2 pr-1"
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
          {sortable ? (
            <div {...listeners} className="shrink-0 cursor-grab">
              <GripVerticalIcon className="size-4 text-muted-foreground" />
            </div>
          ) : null}
          <Typography variant="base-regular" className="truncate">
            {prompt.name}
          </Typography>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onSetPrompt()
                }}
              >
                <ArrowUpRightIcon className="size-4 sm:size-5" />
                <span className="sr-only">Edit prompt before sending</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit before sending</TooltipContent>
          </Tooltip>
          {additionalActions}
        </div>
      </div>
    </CommandItem>
  )
}
PromptSelectorItem.displayName = "PromptSelectorItem"
