import { Check, Clipboard } from "lucide-react"
import { useRef, useState } from "react"

export function CodeBlock(props: React.ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const extra = props as Record<string, unknown>
  const meta = extra["data-meta"] as string | undefined
  const title = meta?.match(/title="([^"]+)"/)?.[1]
  const icon = extra.icon as string | undefined
  const style = props.style as Record<string, string> | undefined

  const handleCopy = () => {
    const text = preRef.current?.textContent ?? ""
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <figure
      className="shiki not-prose my-4 relative rounded-xl border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar"
      style={{ ...style, backgroundColor: undefined }}
    >
      {title ? (
        <div className="flex items-center gap-2 h-9.5 border-b px-4 text-muted-foreground">
          {icon && (
            <span
              className="size-3.5 [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          )}
          <span className="flex-1 truncate text-xs font-medium">{title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="-me-2 p-1 rounded-md hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Clipboard className="size-3.5" />
            )}
          </button>
        </div>
      ) : (
        <div className="empty:hidden absolute top-2 right-2 z-10 backdrop-blur-lg rounded-lg text-muted-foreground">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Clipboard className="size-3.5" />
            )}
          </button>
        </div>
      )}
      <div className="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px]">
        <pre
          {...props}
          ref={preRef}
          style={undefined}
          className="min-w-full w-max [&>code]:flex [&>code]:flex-col"
        />
      </div>
    </figure>
  )
}
