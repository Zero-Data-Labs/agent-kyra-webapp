import { Typography } from "@/components/ui/typography"
import { cn } from "@/styles/utils"

type MessageBlockProps = React.ComponentProps<"div">

export function MessageBlock(props: MessageBlockProps) {
  const { className, ...divProps } = props

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-primary/5 p-4",
        className
      )}
      {...divProps}
    />
  )
}
MessageBlock.displayName = "MessageBlock"

type MessageBlockTitleProps = React.ComponentProps<typeof Typography>

export function MessageBlockTitle(props: MessageBlockTitleProps) {
  const { variant = "base-semibold", className, ...typographyProps } = props

  return (
    <Typography
      variant={variant}
      className={cn(className)}
      {...typographyProps}
    />
  )
}
MessageBlockTitle.displayName = "MessageBlockTitle"

type MessageBlockBodyProps = React.ComponentProps<typeof Typography>

export function MessageBlockBody(props: MessageBlockBodyProps) {
  const { variant = "base-regular", className, ...typographyProps } = props

  // TODO: Maybe use the Markdown renderer here instead of a plain Typography component

  return (
    <Typography
      variant={variant}
      className={cn(className)}
      {...typographyProps}
    />
  )
}
MessageBlockBody.displayName = "MessageBlockBody"
