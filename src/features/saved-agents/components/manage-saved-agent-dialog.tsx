"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useCallback, useEffect, useState } from "react"
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
import { SavedAgentFormDataSchema } from "@/features/saved-agents/schemas"
import type { SavedAgentFormData } from "@/features/saved-agents/types"
import { Logger } from "@/features/telemetry/logger"
import { cn } from "@/styles/utils"

const logger = Logger.create("saved-agents")

export interface ManageSavedAgentDialogProps {
  type: "create" | "edit"
  initialData: Partial<SavedAgentFormData>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SavedAgentFormData) => Promise<void>
  onDelete?: () => Promise<void>
}

export function ManageSavedAgentDialog(props: ManageSavedAgentDialogProps) {
  const { type, initialData, open, onOpenChange, onSubmit, onDelete } = props

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SavedAgentFormData>({
    resolver: zodResolver(SavedAgentFormDataSchema),
    defaultValues: {
      name: initialData.name ?? "",
    },
  })

  const handleSubmit = useCallback(
    async (data: SavedAgentFormData) => {
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
                {type === "create" ? "Create Agent" : "Edit Agent"}
              </DialogTitle>
              <DialogDescription>
                An AI agent lets you organise your prompts and fine-tune your
                requests
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
                      A name to identify your agent
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
                <DeleteSavedAgentDialog
                  onDelete={handleDelete}
                  isProcessing={isSubmitting}
                >
                  <Button variant="outline-destructive" disabled={isSubmitting}>
                    Delete
                  </Button>
                </DeleteSavedAgentDialog>
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
ManageSavedAgentDialog.displayName = "ManageSavedAgentDialog"

interface DeleteSavedAgentDialogProps {
  children: ReactNode
  onDelete: () => Promise<void>
  isProcessing: boolean
}

function DeleteSavedAgentDialog(props: DeleteSavedAgentDialogProps) {
  const { children, onDelete, isProcessing } = props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            Are you sure you want to delete this agent? This action cannot be
            undone.
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
DeleteSavedAgentDialog.displayName = "DeleteSavedAgentDialog"
