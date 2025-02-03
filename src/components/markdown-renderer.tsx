import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/styles/utils"

export type MarkdownRendererProps = Pick<
  React.ComponentProps<typeof ReactMarkdown>,
  "children"
> &
  Omit<React.ComponentProps<"div">, "children">

export function MarkdownRenderer(props: MarkdownRendererProps) {
  const { children, className, ...divProps } = props

  return (
    <div className={cn("prose prose-sm", className)} {...divProps}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          pre: ({ node, ...props }) => (
            <pre className="overflow-x-auto" {...props} />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code: ({ node, ...props }) => (
            <code className="overflow-x-auto" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
MarkdownRenderer.displayName = "MarkdownRenderer"
