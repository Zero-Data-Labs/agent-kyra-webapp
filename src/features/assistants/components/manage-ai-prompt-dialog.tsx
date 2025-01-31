"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AiPromptFormDataSchema } from "@/features/assistants/schemas"
import type { AiPromptFormData } from "@/features/assistants/types"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"

const logger = Logger.create("assistants")

export type ManageAiPromptDialogProps = {
  type: "create" | "edit"
  initialData: Partial<AiPromptFormData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AiPromptFormData) => Promise<void>
  onDelete?: () => Promise<void>
}

export function ManageAiPromptDialog(props: ManageAiPromptDialogProps) {
  const { type, initialData, open, onOpenChange, onSubmit, onDelete } = props

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AiPromptFormData>({
    resolver: zodResolver(AiPromptFormDataSchema),
    defaultValues: {
      name: initialData.name ?? "",
      prompt: initialData.prompt ?? "",
    },
  })

  const handleSubmit = useCallback(
    async (data: AiPromptFormData) => {
      setIsSubmitting(true)
      try {
        await onSubmit(data)
        onOpenChange(false)
      } catch (error) {
        logger.error(error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, onOpenChange]
  )

  const handleDelete = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await onDelete?.()
      onOpenChange(false)
    } catch (error) {
      logger.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [onDelete, onOpenChange])

  useEffect(() => {
    form.setValue("name", initialData?.name ?? "")
    form.setValue("prompt", initialData?.prompt ?? "")
    // HACK: On version 7.54.0 `form` is causing an infinite re-render loop
    // so had to remove it from the dependency array which is not a big deal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (!open) {
      form.clearErrors()
      form.resetField("name")
      form.resetField("prompt")
    }
    // HACK: On version 7.54.0 `form` is causing an infinite re-render loop
    // so had to remove it from the dependency array which is not a big deal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>{type === "create" ? "Save" : "Edit"}</DialogTitle>
              <DialogDescription>
                {type === "create"
                  ? "Save your prompt to reuse it later"
                  : "Edit your prompt"}
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-6 px-0.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A short label describing this prompt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="true"
                        className="max-h-32 min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your message sent to the assistant
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter
              className={cn(
                type === "edit" && onDelete ? "sm:justify-between" : ""
              )}
            >
              {type === "edit" && onDelete ? (
                <DeleteAiPromptDialog
                  onDelete={handleDelete}
                  isProcessing={isSubmitting}
                >
                  <Button variant="outline-destructive" disabled={isSubmitting}>
                    Delete
                  </Button>
                </DeleteAiPromptDialog>
              ) : null}
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
ManageAiPromptDialog.displayName = "AssistantManagePromptDialog"

type DeleteAiPromptDialogProps = {
  children: React.ReactNode
  onDelete: () => Promise<void>
  isProcessing: boolean
}

function DeleteAiPromptDialog(props: DeleteAiPromptDialogProps) {
  const { children, onDelete, isProcessing } = props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            Are you sure you want to delete this prompt?
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isProcessing}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
DeleteAiPromptDialog.displayName = "DeletePromptDialog"
