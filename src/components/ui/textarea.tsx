"use client"

import React, { useCallback, useLayoutEffect, useRef } from "react"

import { cn } from "@/styles/utils"

export type TextareaProps = {
  containerClassName?: React.ComponentProps<"div">["className"]
  startAdornment?: React.ReactNode
  startAdornmentContainerClassName?: React.ComponentProps<"div">["className"]
  endAdornment?: React.ReactNode
  endAdornmentContainerClassName?: React.ComponentProps<"div">["className"]
} & Omit<React.ComponentProps<"textarea">, "rows">

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      className,
      onChange,
      containerClassName,
      startAdornment,
      startAdornmentContainerClassName,
      endAdornment,
      endAdornmentContainerClassName,
      ...textareaProps
    } = props

    // Create internal ref if no ref is provided
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const resolvedRef =
      (ref as React.MutableRefObject<HTMLTextAreaElement>) || textareaRef

    const adjustHeight = useCallback(() => {
      if (!resolvedRef.current) {
        return
      }

      // Reset height to auto to get the correct scrollHeight
      resolvedRef.current.style.height = "auto"
      // Set the height to match the content
      resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`
    }, [resolvedRef])

    // Handle changes to resize the textarea
    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
      useCallback(
        (event) => {
          adjustHeight()
          onChange?.(event)
        },
        [adjustHeight, onChange]
      )

    // Adjust height on mount and when content changes
    useLayoutEffect(() => {
      const abortController = new AbortController()
      requestAnimationFrame(adjustHeight)

      const handleResize = () => {
        requestAnimationFrame(adjustHeight)
      }

      window.addEventListener("resize", handleResize, {
        signal: abortController.signal,
      })

      return () => {
        abortController.abort()
      }
    }, [adjustHeight, textareaProps.value])

    return (
      <div
        className={cn(
          "relative flex w-full flex-row items-center",
          containerClassName
        )}
      >
        {startAdornment ? (
          <div
            className={cn("absolute left-0", startAdornmentContainerClassName)}
          >
            {startAdornment}
          </div>
        ) : null}
        <textarea
          ref={resolvedRef}
          className={cn(
            "flex w-full resize-none rounded-md border border-border bg-surface py-2 text-base leading-5 ring-offset-surface placeholder:text-muted-foreground hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startAdornment ? "pl-10" : "pl-3",
            endAdornment ? "pr-10" : "pr-3",
            className
          )}
          onChange={handleChange}
          rows={1}
          aria-multiline
          {...textareaProps}
        />
        {endAdornment ? (
          <div
            className={cn("absolute right-0", endAdornmentContainerClassName)}
          >
            {endAdornment}
          </div>
        ) : null}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
