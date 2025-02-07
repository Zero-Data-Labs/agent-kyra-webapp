"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useLocalStorage } from "usehooks-ts"

import {
  AgentChatContext,
  type AgentChatContextType,
} from "@/features/agent-chat/contexts/agent-chat-context"
import type {
  AgentOutput,
  LlmApiHotloadResult,
  PromptInput,
} from "@/features/agent-chat/types"
import {
  hotloadLlmApi,
  sendPromptInputToAgent,
} from "@/features/agent-chat/utils"
import { DEFAULT_AGENT } from "@/features/saved-agents/constants"
import { prefetchGetSavedPrompts } from "@/features/saved-prompts/hooks/use-get-saved-prompts"
import { Logger } from "@/features/telemetry/logger"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

const logger = Logger.create("agent-chat")

export interface AgentChatProviderProps {
  children: ReactNode
}

/**
 * This component provides the context for the AI Agent functionality.
 * It manages the latest user prompt and agent reply, processing status, and errors.
 */
export function AgentChatProvider(props: AgentChatProviderProps) {
  const { children } = props
  const { token } = useVeridaAuth()

  const queryClient = useQueryClient()

  const [selectedAgent, setSelectedAgent] = useLocalStorage(
    "kyra-selected-agent",
    DEFAULT_AGENT._id,
    {
      initializeWithValue: true,
    }
  )
  const [promptInput, setPromptInput] = useState<PromptInput | null>(null)
  const [agentOutput, setAgentOutput] = useState<AgentOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hotload, setHotload] = useState<LlmApiHotloadResult>({
    status: "idle",
    progress: 0,
  })
  const [promptSearchValue, setPromptSearchValue] = useState("")

  const initialise = useCallback(async () => {
    if (!token) {
      return
    }

    logger.info("Initialising the LLM API")
    setHotload({ status: "loading", progress: 0 })

    await hotloadLlmApi(token, (progress, dataCurrentlyLoading) => {
      setHotload({ status: "loading", progress, dataCurrentlyLoading })
    })

    setHotload({ status: "success", progress: 1 })
    logger.info("LLM API initialized")
  }, [token])

  useEffect(() => {
    // TODO: Uncomment the initialise once the hotloading is fixed
    // initialise().catch((error) => {
    //   logger.error(error)
    //   setHotload({ status: "error", progress: 0 })
    // })
  }, [initialise])

  useEffect(() => {
    if (!token) {
      return
    }

    prefetchGetSavedPrompts({
      queryClient,
      authToken: token,
      filter: {
        assistantId: selectedAgent,
      },
    })
  }, [token, selectedAgent, queryClient])

  const processInput = useCallback(
    async (input: PromptInput) => {
      if (!token) {
        return
      }

      if (agentOutput?.status === "processing") {
        return
      }

      if (!input.prompt) {
        return
      }

      logger.info("Sending user input to agent")
      setError(null)
      setAgentOutput({
        agentId: input.agentId,
        status: "processing",
      })

      try {
        const result = await sendPromptInputToAgent(
          {
            ...input,
            agentId: selectedAgent,
          },
          token
        )
        setAgentOutput(result)
      } catch (error) {
        logger.error(error)
        // TODO: Analyse error and set appropriate error message
        setError("Something went wrong with the agent")
        setAgentOutput(null)
      }
    },
    [token, agentOutput, selectedAgent]
  )

  const processPromptInput = useCallback(async () => {
    if (!promptInput) {
      return
    }
    await processInput(promptInput)
  }, [promptInput, processInput])

  const setAndProcessPromptInput = useCallback(
    async (input: PromptInput) => {
      setPromptInput(input)
      await processInput(input)
    },
    [processInput]
  )

  const clearPromptInput = useCallback(() => {
    setPromptInput(null)
  }, [])

  const clearAgentOutput = useCallback(() => {
    setAgentOutput(null)
  }, [])

  const value = useMemo<AgentChatContextType>(
    () => ({
      selectedAgent,
      setSelectedAgent,
      promptInput,
      agentOutput,
      processPromptInput,
      setAndProcessPromptInput,
      updatePromptInput: setPromptInput,
      clearPromptInput,
      clearAgentOutput,
      error,
      hotload,
      promptSearchValue,
      setPromptSearchValue,
    }),
    [
      selectedAgent,
      setSelectedAgent,
      promptInput,
      agentOutput,
      processPromptInput,
      setAndProcessPromptInput,
      setPromptInput,
      clearPromptInput,
      clearAgentOutput,
      error,
      hotload,
      promptSearchValue,
      setPromptSearchValue,
    ]
  )

  return <AgentChatContext value={value}>{children}</AgentChatContext>
}
AgentChatProvider.displayName = "AgentChatProvider"
