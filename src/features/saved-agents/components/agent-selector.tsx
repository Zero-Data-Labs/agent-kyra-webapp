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
import { type ComponentProps, useCallback, useMemo, useState } from "react"

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
import { getAgentPageRoute } from "@/features/routes/utils"
import {
  DEFAULT_AGENT,
  DEFAULT_AGENT_ORDER,
  MAX_NB_AGENTS,
} from "@/features/saved-agents/constants"
import { useGetSavedAgents } from "@/features/saved-agents/hooks/use-get-saved-agents"
import { useSavedAgentDialog } from "@/features/saved-agents/hooks/use-saved-agent-dialog"
import { useUpdateSavedAgent } from "@/features/saved-agents/hooks/use-update-saved-agent"
import type {
  SavedAgentFormData,
  SavedAgentRecord,
} from "@/features/saved-agents/types"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"
import { moveItemInArray } from "@/utils/misc"

const logger = Logger.create("saved-agents")

export interface AgentSelectorProps
  extends Omit<ComponentProps<"div">, "children"> {
  currentAgentId?: string
  onCreateClick?: () => void
  onItemSelect?: (savedAgent: SavedAgentRecord) => void
  onEditClick?: (savedAgent: SavedAgentRecord) => void
  hideSearch?: boolean
}

export function AgentSelector(props: AgentSelectorProps) {
  const {
    currentAgentId,
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

  const { openCreateDialog, openEditDialog } = useSavedAgentDialog()
  const { savedAgents } = useGetSavedAgents()
  const { updateSavedAgentAsync } = useUpdateSavedAgent()

  const handleCreateClick = useCallback(
    (data?: Partial<SavedAgentFormData>) => {
      openCreateDialog(data)
      onCreateClick?.()
    },
    [openCreateDialog, onCreateClick]
  )

  const handleItemSelect = useCallback(
    (savedAgent: SavedAgentRecord) => {
      onItemSelect?.(savedAgent)
      router.push(getAgentPageRoute({ agentId: savedAgent._id }))
    },
    [onItemSelect, router]
  )

  const handleEditClick = useCallback(
    (savedAgent: SavedAgentRecord) => {
      openEditDialog(savedAgent)
      onEditClick?.(savedAgent)
    },
    [openEditDialog, onEditClick]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue("")
  }, [setSearchValue])

  const sortedAgentIds = useMemo(() => {
    return savedAgents
      ? savedAgents.map((savedAgent) => ({
          id: savedAgent._id,
        }))
      : []
  }, [savedAgents])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      if (!savedAgents) {
        return
      }

      const { active, over } = event

      if (active.id === over?.id) {
        return
      }

      const oldIndex = savedAgents.findIndex(
        (savedAgent) => savedAgent._id === active.id
      )
      const newIndex = savedAgents.findIndex(
        (savedAgent) => savedAgent._id === over?.id
      )

      const movedAgent = savedAgents[oldIndex]
      const newSavedAgents = moveItemInArray(savedAgents, oldIndex, newIndex)

      // Get previous and next agents for order calculation
      const prevAgent = newIndex > 0 ? newSavedAgents[newIndex - 1] : null
      const nextAgent =
        newIndex < newSavedAgents.length - 1
          ? newSavedAgents[newIndex + 1]
          : null

      let newOrder: number

      if (prevAgent?.order !== undefined && nextAgent?.order !== undefined) {
        // Both neighbors have order - set as average
        newOrder = (prevAgent.order + nextAgent.order) / 2
      } else if (prevAgent?.order !== undefined) {
        // Only previous has order - add DEFAULT_AGENT_ORDER
        newOrder = prevAgent.order + DEFAULT_AGENT_ORDER
      } else if (nextAgent?.order !== undefined) {
        // Only next has order - subtract DEFAULT_AGENT_ORDER
        newOrder = nextAgent.order - DEFAULT_AGENT_ORDER
      } else {
        // Neither has order - start at DEFAULT_AGENT_ORDER * position
        newOrder = (newIndex + 1) * DEFAULT_AGENT_ORDER
      }

      try {
        // Update the moved agent with new order
        await updateSavedAgentAsync({
          ...movedAgent,
          order: newOrder,
        } as SavedAgentRecord)
      } catch (error) {
        logger.error(
          new Error("Failed to update agent order", { cause: error })
        )
      }
    },
    [savedAgents, updateSavedAgentAsync]
  )

  const isMaxNbSavedAgentsReached = useMemo(() => {
    return savedAgents ? savedAgents?.length >= MAX_NB_AGENTS : false
  }, [savedAgents])

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
          {savedAgents && savedAgents.length > 0 ? (
            <CommandGroup heading="Your agents" className="p-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedAgentIds}
                  strategy={verticalListSortingStrategy}
                >
                  {savedAgents?.map((savedAgent) => (
                    <AgentSelectorItem
                      key={savedAgent._id}
                      agent={savedAgent}
                      sortable={savedAgents.length > 1}
                      isSelected={currentAgentId === savedAgent._id}
                      onSelect={() => {
                        handleItemSelect(savedAgent)
                      }}
                      onEditClick={() => {
                        handleEditClick(savedAgent)
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CommandGroup>
          ) : (
            <CommandGroup heading="Suggested" className="p-2">
              <AgentSelectorItem
                agent={DEFAULT_AGENT}
                isSelected={currentAgentId === DEFAULT_AGENT._id}
                onSelect={() => {
                  handleItemSelect(DEFAULT_AGENT)
                }}
                onEditClick={() => {
                  handleCreateClick(DEFAULT_AGENT)
                }}
              />
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup className="p-2">
            <CommandItem
              onSelect={() => handleCreateClick()}
              disabled={isMaxNbSavedAgentsReached}
              className="flex h-12 cursor-pointer flex-row items-center py-1 pl-2 pr-1 text-muted-foreground"
            >
              <Typography variant="base-semibold" className="truncate">
                {isMaxNbSavedAgentsReached
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
AgentSelector.displayName = "AgentSelector"

interface AgentSelectorItemProps {
  sortable?: boolean
  agent: SavedAgentRecord
  isSelected?: boolean
  onSelect?: () => void
  onEditClick?: () => void
}

function AgentSelectorItem(props: AgentSelectorItemProps) {
  const { agent, isSelected, onSelect, onEditClick, sortable } = props

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: agent._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <CommandItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      value={agent.name}
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
            {agent.name}
          </Typography>
          {isSelected ? (
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
AgentSelectorItem.displayName = "AgentSelectorItem"
