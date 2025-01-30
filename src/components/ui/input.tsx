import React from "react"

import { cn } from "@/styles/utils"

export type InputProps = {
  containerClassName?: React.ComponentProps<"div">["className"]
  startAdornment?: React.ReactNode
  startAdornmentContainerClassName?: React.ComponentProps<"div">["className"]
  endAdornment?: React.ReactNode
  endAdornmentContainerClassName?: React.ComponentProps<"div">["className"]
} & React.ComponentProps<"input">

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      type,
      className,
      containerClassName,
      startAdornment,
      startAdornmentContainerClassName,
      endAdornment,
      endAdornmentContainerClassName,
      ...inputProps
    } = props

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
        <input
          type={type}
          className={cn(
            "bg-surface ring-offset-surface hover:border-border-hover flex h-10 w-full rounded-md border border-border py-2 text-base leading-5 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startAdornment ? "pl-10" : "pl-3",
            endAdornment ? "pr-10" : "pr-3",
            className
          )}
          ref={ref}
          {...inputProps}
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
Input.displayName = "Input"
