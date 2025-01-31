"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LLM_MODEL_DEFS } from "@/features/assistants/constants"
import { useAssistants } from "@/features/assistants/hooks/use-assistants"
import { PromptConfigFormDataSchema } from "@/features/assistants/schemas"
import type { PromptConfigFormData } from "@/features/assistants/types"
import { useToast } from "@/features/toasts/use-toast"

export type ManageAiPromptConfigDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageAiPromptConfigDialog(
  props: ManageAiPromptConfigDialogProps
) {
  const { open, onOpenChange } = props

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const { aiPromptInput, updateAiPromptInput } = useAssistants()

  const form = useForm<PromptConfigFormData>({
    resolver: zodResolver(PromptConfigFormDataSchema),
    defaultValues: {
      llmModel: aiPromptInput?.config?.llmModel ?? "CLAUDE_HAIKU_3.5",
      rawPromptConfig: aiPromptInput?.config?.promptConfig
        ? JSON.stringify(aiPromptInput.config.promptConfig, null, 2)
        : undefined,
    },
  })

  const handleSubmit = useCallback(
    async (data: PromptConfigFormData) => {
      setIsSubmitting(true)
      try {
        const promptConfig = data.rawPromptConfig
          ? JSON.parse(data.rawPromptConfig)
          : undefined

        updateAiPromptInput((prevInput) => ({
          ...prevInput,
          config: {
            ...prevInput?.config,
            llmModel: data.llmModel,
            promptConfig,
          },
        }))
        onOpenChange(false)

        toast({
          variant: "success",
          title: "Prompt configuration saved",
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          variant: "error",
          title: "Failed to save prompt configuration",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [updateAiPromptInput, onOpenChange, toast]
  )

  useEffect(() => {
    form.setValue(
      "llmModel",
      aiPromptInput?.config?.llmModel ?? "CLAUDE_HAIKU_3.5"
    )
    form.setValue(
      "rawPromptConfig",
      aiPromptInput?.config?.promptConfig
        ? JSON.stringify(aiPromptInput.config.promptConfig, null, 2)
        : undefined
    )
    // HACK: On version 7.54.0 `form` is causing an infinite re-render loop
    // so had to remove it from the dependency array which is not a big deal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPromptInput])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Configuration</DialogTitle>
              <DialogDescription>
                Fine-tune the configuration of your prompt
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-6 px-0.5">
              <FormField
                control={form.control}
                name="llmModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LLM_MODEL_DEFS).map((modelDef) => (
                          <SelectItem
                            key={modelDef.model}
                            value={modelDef.model}
                          >
                            {modelDef.model === "CLAUDE_HAIKU_3.5"
                              ? `${modelDef.label} (default)`
                              : modelDef.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The AI model to use</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rawPromptConfig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advanced configuration</FormLabel>
                    <FormControl>
                      <Textarea
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="true"
                        // FIXME: Fix height of the textarea overflowing the dialog when resized
                        className="max-h-96 min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Refer to the{" "}
                      <Link
                        href="https://user-apis.verida.network/#61bf5cf2-cb2e-43af-b592-f89d0b0d291a"
                        target="_blank"
                        className="text-primary underline"
                      >
                        Prompt Config
                      </Link>{" "}
                      documentation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
ManageAiPromptConfigDialog.displayName = "ManageAiPromptConfigDialog"
