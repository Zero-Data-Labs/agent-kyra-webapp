"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { AiAssistantFormDataSchema } from "@/features/assistants/schemas"
import type { AiAssistantFormData } from "@/features/assistants/types"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"

const logger = Logger.create("assistants")

export type ManageAiAssistantDialogProps = {
  type: "create" | "edit"
  initialData: Partial<AiAssistantFormData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AiAssistantFormData) => Promise<void>
  onDelete?: () => Promise<void>
}

export function ManageAiAssistantDialog(props: ManageAiAssistantDialogProps) {
  const { type, initialData, open, onOpenChange, onSubmit, onDelete } = props

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AiAssistantFormData>({
    resolver: zodResolver(AiAssistantFormDataSchema),
    defaultValues: {
      name: initialData.name ?? "",
    },
  })

  const handleSubmit = useCallback(
    async (data: AiAssistantFormData) => {
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
    // HACK: On version 7.54.0 `form` is causing an infinite re-render loop
    // so had to remove it from the dependency array which is not a big deal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (!open) {
      form.clearErrors()
      form.reset()
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
              <DialogTitle>
                {type === "create" ? "Create Assistant" : "Edit Assistant"}
              </DialogTitle>
              <DialogDescription>
                An AI assistant lets you organise your prompts and fine-tune
                your requests
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-6 px-0.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A name to identify your assistant
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Alert variant="info">
                <AlertDescription>
                  Custom instructions and settings are coming soon
                </AlertDescription>
              </Alert>
            </DialogBody>
            <DialogFooter
              className={cn(
                type === "edit" && onDelete ? "sm:justify-between" : ""
              )}
            >
              {type === "edit" && onDelete ? (
                <DeleteAiAssistantDialog
                  onDelete={handleDelete}
                  isProcessing={isSubmitting}
                >
                  <Button variant="outline-destructive" disabled={isSubmitting}>
                    Delete
                  </Button>
                </DeleteAiAssistantDialog>
              ) : null}
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {type === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
ManageAiAssistantDialog.displayName = "ManageAiAssistantDialog"

type DeleteAiAssistantDialogProps = {
  children: React.ReactNode
  onDelete: () => Promise<void>
  isProcessing: boolean
}

function DeleteAiAssistantDialog(props: DeleteAiAssistantDialogProps) {
  const { children, onDelete, isProcessing } = props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Assistant</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            Are you sure you want to delete this assistant? This action cannot
            be undone.
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
DeleteAiAssistantDialog.displayName = "DeleteAssistantDialog"
