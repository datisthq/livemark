import { Check, ChevronDown, Clipboard, WrapText } from "lucide-react"
import { useRef, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../elements/tooltip.tsx"

export function CodeBlock(props: React.ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false)
  const [wrap, setWrap] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const extra = props as Record<string, unknown>
  const meta = extra["data-meta"] as string | undefined
  const title = meta?.match(/title="([^"]+)"/)?.[1]
  const maxLines = meta?.match(/maxLines=(\d+)/)?.[1]
  const icon = extra.icon as string | undefined
  const style = props.style as Record<string, string> | undefined
  const collapsedHeight = maxLines
    ? `${Number(maxLines) * 1.5 + 1.75}rem`
    : undefined

  const handleCopy = () => {
    const text = preRef.current?.textContent ?? ""
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWrapToggle = () => {
    setWrap(prev => !prev)
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
          <Tooltip>
            <TooltipTrigger
              onClick={handleWrapToggle}
              className={`-me-2 p-1 rounded-md hover:text-foreground transition-colors ${wrap ? "text-foreground" : ""}`}
            >
              <WrapText className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              {wrap ? "Disable wrap" : "Enable wrap"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              className="-me-2 p-1 rounded-md hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Clipboard className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="empty:hidden absolute top-2 right-2 z-10 backdrop-blur-lg rounded-lg text-muted-foreground">
          <Tooltip>
            <TooltipTrigger
              onClick={handleWrapToggle}
              className={`p-1 rounded-md hover:text-foreground transition-colors ${wrap ? "text-foreground" : ""}`}
            >
              <WrapText className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>
              {wrap ? "Disable wrap" : "Enable wrap"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              className="p-1 rounded-md hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Clipboard className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
          </Tooltip>
        </div>
      )}
      <div
        className="text-[0.8125rem] py-3.5 overflow-auto transition-[max-height] duration-300"
        style={{
          maxHeight: collapsedHeight && !expanded ? collapsedHeight : "600px",
        }}
      >
        <pre
          {...props}
          ref={preRef}
          style={undefined}
          className={
            wrap
              ? "min-w-full whitespace-pre-wrap break-words [&>code]:flex [&>code]:flex-col"
              : "min-w-full w-max [&>code]:flex [&>code]:flex-col"
          }
        />
      </div>
      {collapsedHeight && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center gap-1 w-full py-1.5 text-xs text-muted-foreground hover:text-foreground border-t cursor-pointer transition-colors"
        >
          <ChevronDown className="size-3.5" />
          Expand
        </button>
      )}
    </figure>
  )
}
