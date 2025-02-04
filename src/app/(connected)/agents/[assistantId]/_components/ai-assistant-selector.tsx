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
import { CheckIcon, GripVerticalIcon, PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useCallback, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import {
  DEFAULT_ASSISTANT,
  DEFAULT_ASSISTANT_ORDER,
  MAX_NB_ASSISTANTS,
} from "@/features/assistants/constants"
import { useAiAssistantDialog } from "@/features/assistants/hooks/use-ai-assistant-dialog"
import { useGetAiAssistants } from "@/features/assistants/hooks/use-get-ai-assistants"
import { useUpdateAiAssistant } from "@/features/assistants/hooks/use-update-ai-assistant"
import type {
  AiAssistantFormData,
  AiAssistantRecord,
} from "@/features/assistants/types"
import { getAgentPageRoute } from "@/features/routes/utils"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"
import { moveItemInArray } from "@/utils/misc"

const logger = Logger.create("assistants")

export type AiAssistantSelectorProps = {
  currentAssistantId?: string
  onCreateClick?: () => void
  onItemSelect?: (assistant: AiAssistantRecord) => void
  onEditClick?: (assistant: AiAssistantRecord) => void
  hideSearch?: boolean
} & Omit<React.ComponentProps<"div">, "children">

export function AiAssistantSelector(props: AiAssistantSelectorProps) {
  const {
    currentAssistantId,
    onCreateClick,
    onItemSelect,
    onEditClick,
    className,
    hideSearch = false,
    ...divProps
  } = props

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const router = useRouter()

  const [searchValue, setSearchValue] = useState("")

  const { openCreateDialog, openEditDialog } = useAiAssistantDialog()
  const { aiAssistants } = useGetAiAssistants()
  const { updateAiAssistantAsync } = useUpdateAiAssistant()

  const handleCreateClick = useCallback(
    (data?: Partial<AiAssistantFormData>) => {
      openCreateDialog(data)
      onCreateClick?.()
    },
    [openCreateDialog, onCreateClick]
  )

  const handleItemSelect = useCallback(
    (assistant: AiAssistantRecord) => {
      onItemSelect?.(assistant)
      router.push(getAgentPageRoute({ agentId: assistant._id }))
    },
    [onItemSelect, router]
  )

  const handleEditClick = useCallback(
    (assistant: AiAssistantRecord) => {
      openEditDialog(assistant)
      onEditClick?.(assistant)
    },
    [openEditDialog, onEditClick]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue("")
  }, [setSearchValue])

  const sortedAiAssistantIds = useMemo(() => {
    return aiAssistants
      ? aiAssistants.map((aiAssistant) => ({
          id: aiAssistant._id,
        }))
      : []
  }, [aiAssistants])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      if (!aiAssistants) {
        return
      }

      const { active, over } = event

      if (active.id === over?.id) {
        return
      }

      const oldIndex = aiAssistants.findIndex(
        (aiAssistant) => aiAssistant._id === active.id
      )
      const newIndex = aiAssistants.findIndex(
        (aiAssistant) => aiAssistant._id === over?.id
      )

      const movedAssistant = aiAssistants[oldIndex]
      const newAiAssistants = moveItemInArray(aiAssistants, oldIndex, newIndex)

      // Get previous and next assistants for order calculation
      const prevAssistant = newIndex > 0 ? newAiAssistants[newIndex - 1] : null
      const nextAssistant =
        newIndex < newAiAssistants.length - 1
          ? newAiAssistants[newIndex + 1]
          : null

      let newOrder: number

      if (
        prevAssistant?.order !== undefined &&
        nextAssistant?.order !== undefined
      ) {
        // Both neighbors have order - set as average
        newOrder = (prevAssistant.order + nextAssistant.order) / 2
      } else if (prevAssistant?.order !== undefined) {
        // Only previous has order - add DEFAULT_ASSISTANT_ORDER
        newOrder = prevAssistant.order + DEFAULT_ASSISTANT_ORDER
      } else if (nextAssistant?.order !== undefined) {
        // Only next has order - subtract DEFAULT_ASSISTANT_ORDER
        newOrder = nextAssistant.order - DEFAULT_ASSISTANT_ORDER
      } else {
        // Neither has order - start at DEFAULT_ASSISTANT_ORDER * position
        newOrder = (newIndex + 1) * DEFAULT_ASSISTANT_ORDER
      }

      try {
        // Update the moved assistant with new order
        await updateAiAssistantAsync({
          ...movedAssistant,
          order: newOrder,
        } as AiAssistantRecord)
      } catch (error) {
        logger.error(
          new Error("Failed to update agent order", { cause: error })
        )
      }
    },
    [aiAssistants, updateAiAssistantAsync]
  )

  const isMaxNbAssistantsReached = useMemo(() => {
    return aiAssistants ? aiAssistants?.length >= MAX_NB_ASSISTANTS : false
  }, [aiAssistants])

  return (
    <div {...divProps} className={cn("rounded-[0.875rem]", className)}>
      <Command loop className="rounded-[0.875rem]">
        {!hideSearch ? (
          <div className="p-2">
            <CommandInput
              placeholder="Search..."
              value={searchValue}
              onValueChange={setSearchValue}
              displayClearButton={searchValue.length > 0}
              onClear={handleClearSearch}
            />
          </div>
        ) : null}
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {aiAssistants && aiAssistants.length > 0 ? (
            <CommandGroup heading="Your agents" className="p-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedAiAssistantIds}
                  strategy={verticalListSortingStrategy}
                >
                  {aiAssistants?.map((aiAssistant) => (
                    <AiAssistantSelectorItem
                      key={aiAssistant._id}
                      assistant={aiAssistant}
                      sortable={aiAssistants.length > 1}
                      isCurrentAssistant={
                        currentAssistantId === aiAssistant._id
                      }
                      onSelect={() => {
                        handleItemSelect(aiAssistant)
                      }}
                      onEditClick={() => {
                        handleEditClick(aiAssistant)
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CommandGroup>
          ) : (
            <CommandGroup heading="Suggested" className="p-2">
              <AiAssistantSelectorItem
                assistant={DEFAULT_ASSISTANT}
                isCurrentAssistant={
                  currentAssistantId === DEFAULT_ASSISTANT._id
                }
                onSelect={() => {
                  handleItemSelect(DEFAULT_ASSISTANT)
                }}
                onEditClick={() => {
                  handleCreateClick(DEFAULT_ASSISTANT)
                }}
              />
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup className="p-2">
            <CommandItem
              onSelect={() => handleCreateClick()}
              disabled={isMaxNbAssistantsReached}
              className="flex h-12 cursor-pointer flex-row items-center py-1 pl-2 pr-1 text-muted-foreground"
            >
              <Typography variant="base-semibold" className="truncate">
                {isMaxNbAssistantsReached
                  ? "Can't create more agents"
                  : "Create a new agent..."}
              </Typography>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
AiAssistantSelector.displayName = "AiAssistantSelector"

type AiAssistantSelectorItemProps = {
  sortable?: boolean
  assistant: AiAssistantRecord
  isCurrentAssistant?: boolean
  onSelect?: () => void
  onEditClick?: () => void
}

function AiAssistantSelectorItem(props: AiAssistantSelectorItemProps) {
  const { assistant, isCurrentAssistant, onSelect, onEditClick, sortable } =
    props

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: assistant._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <CommandItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      value={assistant.name}
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
            {assistant.name}
          </Typography>
          {isCurrentAssistant ? (
            <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : null}
        </div>
        {onEditClick ? (
          <div className="flex shrink-0 flex-row items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditClick?.()
                  }}
                >
                  <PencilIcon className="size-4 sm:size-5" />
                  <span className="sr-only">Edit agent</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit agent</TooltipContent>
            </Tooltip>
          </div>
        ) : null}
      </div>
    </CommandItem>
  )
}
AiAssistantSelectorItem.displayName = "AiAssistantSelectorItem"
