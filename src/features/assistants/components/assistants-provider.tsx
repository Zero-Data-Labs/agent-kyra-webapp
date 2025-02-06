"use client"

import { useQueryClient } from "@tanstack/react-query"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { DEFAULT_ASSISTANT } from "@/features/assistants/constants"
import {
  AssistantsContext,
  type AssistantsContextType,
} from "@/features/assistants/contexts/assistants-context"
import type {
  AiAssistantHotloadResult,
  AiAssistantOutput,
  AiPromptInput,
} from "@/features/assistants/types"
import {
  hotloadAPI,
  sendAiPromptInputToAssistant,
} from "@/features/assistants/utils"
import { prefetchGetSavedPrompts } from "@/features/saved-prompts/hooks/use-get-saved-prompts"
import { Logger } from "@/features/telemetry/logger"
import { useVeridaAuth } from "@/features/verida-auth/hooks/use-verida-auth"

const logger = Logger.create("assistants")

export type AssistantsProviderProps = {
  children: React.ReactNode
}

/**
 * AssistantsProvider component
 *
 * This component provides the context for the AI assistant functionality.
 * It manages the latest user prompt and assistant reply, processing status, and errors.
 */
export function AssistantsProvider(props: AssistantsProviderProps) {
  const { children } = props
  const { token } = useVeridaAuth()

  const queryClient = useQueryClient()

  const [selectedAiAssistant, setSelectedAiAssistant] = useLocalStorage(
    "kyra-selected-agent",
    DEFAULT_ASSISTANT._id,
    {
      initializeWithValue: true,
    }
  )
  const [aiPromptInput, setAiPromptInput] = useState<AiPromptInput | null>(null)
  const [aiAssistantOutput, setAiAssistantOutput] =
    useState<AiAssistantOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hotload, setHotload] = useState<AiAssistantHotloadResult>({
    status: "idle",
    progress: 0,
  })
  const [promptSearchValue, setPromptSearchValue] = useState("")

  const initialise = useCallback(async () => {
    if (!token) {
      return
    }

    logger.info("Initialising the assistant")
    setHotload({ status: "loading", progress: 0 })

    await hotloadAPI(token, (progress, dataCurrentlyLoading) => {
      setHotload({ status: "loading", progress, dataCurrentlyLoading })
    })

    setHotload({ status: "success", progress: 1 })
    logger.info("Assistant initialized")
  }, [token])

  useEffect(() => {
    initialise().catch((error) => {
      logger.error(error)
      setHotload({ status: "error", progress: 0 })
    })
  }, [initialise])

  useEffect(() => {
    if (!token) {
      return
    }

    prefetchGetSavedPrompts({
      queryClient,
      authToken: token,
      filter: {
        assistantId: selectedAiAssistant,
      },
    })
  }, [token, selectedAiAssistant, queryClient])

  const processInput = useCallback(
    async (input: AiPromptInput) => {
      if (!token) {
        return
      }

      if (aiAssistantOutput?.status === "processing") {
        return
      }

      if (!input.prompt) {
        return
      }

      logger.info("Sending user input to assistant")
      setError(null)
      setAiAssistantOutput({
        assistantId: input.assistantId,
        status: "processing",
      })

      try {
        const result = await sendAiPromptInputToAssistant(
          {
            ...input,
            assistantId: selectedAiAssistant,
          },
          token
        )
        setAiAssistantOutput(result)
      } catch (error) {
        logger.error(error)
        // TODO: Analyse error and set appropriate error message
        setError("Something went wrong with the assistant")
        setAiAssistantOutput(null)
      }
    },
    [token, aiAssistantOutput, selectedAiAssistant]
  )

  const processAiPromptInput = useCallback(async () => {
    if (!aiPromptInput) {
      return
    }
    await processInput(aiPromptInput)
  }, [aiPromptInput, processInput])

  const setAndProcessAiPromptInput = useCallback(
    async (input: AiPromptInput) => {
      setAiPromptInput(input)
      await processInput(input)
    },
    [processInput]
  )

  const clearAiPromptInput = useCallback(() => {
    setAiPromptInput(null)
  }, [])

  const clearAiAssistantOutput = useCallback(() => {
    setAiAssistantOutput(null)
  }, [])

  const value = useMemo<AssistantsContextType>(
    () => ({
      selectedAiAssistant,
      setSelectedAiAssistant,
      aiPromptInput,
      aiAssistantOutput,
      processAiPromptInput,
      setAndProcessAiPromptInput,
      updateAiPromptInput: setAiPromptInput,
      clearAiPromptInput,
      clearAiAssistantOutput,
      error,
      hotload,
      promptSearchValue,
      setPromptSearchValue,
    }),
    [
      selectedAiAssistant,
      setSelectedAiAssistant,
      aiPromptInput,
      aiAssistantOutput,
      processAiPromptInput,
      setAndProcessAiPromptInput,
      setAiPromptInput,
      clearAiPromptInput,
      clearAiAssistantOutput,
      error,
      hotload,
      promptSearchValue,
      setPromptSearchValue,
    ]
  )

  return (
    <AssistantsContext.Provider value={value}>
      {children}
    </AssistantsContext.Provider>
  )
}
AssistantsProvider.displayName = "AssistantsProvider"
