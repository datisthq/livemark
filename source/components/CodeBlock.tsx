import { Check, ChevronDown, Clipboard, WrapText } from "lucide-react"
import { isValidElement, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../elements/tooltip.tsx"
import { readCodeIcon } from "../helpers/code-icon.ts"
import { useMessages } from "../hooks/site.ts"

export function CodeBlock(props: React.ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false)
  const t = useMessages()
  const [wrap, setWrap] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const extra = props as Record<string, unknown>
  const meta = extra["data-meta"] as string | undefined
  const title = meta?.match(/title="([^"]+)"/)?.[1]
  const maxLines = meta?.match(/maxLines=(\d+)/)?.[1]
  const icon = readCodeIcon(readLanguage(props.children))
  const lineNumbers = meta?.match(/\blineNumbers(?:=(\d+))?(?!\S)/)
  const style = props.style as Record<string, string> | undefined
  const collapsedHeight = maxLines ? `${Number(maxLines) * 1.5 + 1.75}rem` : undefined

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
      className="shiki not-prose my-4 relative rounded-card border shadow-sm overflow-hidden text-sm bg-sidebar dark:bg-sidebar"
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
              aria-label={wrap ? t("code.wrapOff") : t("code.wrapOn")}
              className={`-me-2 p-1.5 rounded-control hover:text-foreground transition-colors ${wrap ? "text-foreground" : ""}`}
            >
              <WrapText className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{wrap ? t("code.wrapOff") : t("code.wrapOn")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              aria-label={copied ? t("code.copied") : t("code.copy")}
              className="-me-2 p-1.5 rounded-control hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Clipboard className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>{copied ? t("code.copied") : t("code.copy")}</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="empty:hidden absolute top-2 right-2 z-10 backdrop-blur-lg rounded-control text-muted-foreground">
          <Tooltip>
            <TooltipTrigger
              onClick={handleWrapToggle}
              aria-label={wrap ? t("code.wrapOff") : t("code.wrapOn")}
              className={`p-1.5 rounded-control hover:text-foreground transition-colors ${wrap ? "text-foreground" : ""}`}
            >
              <WrapText className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{wrap ? t("code.wrapOff") : t("code.wrapOn")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopy}
              aria-label={copied ? t("code.copied") : t("code.copy")}
              className="p-1.5 rounded-control hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Clipboard className="size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>{copied ? t("code.copied") : t("code.copy")}</TooltipContent>
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
          style={
            lineNumbers
              ? { counterReset: `line ${Number(lineNumbers[1] ?? 1) - 1}` }
              : undefined
          }
          className={[
            props.className,
            lineNumbers && "line-numbers",
            wrap
              ? "min-w-full whitespace-pre-wrap break-words [&>code]:flex [&>code]:flex-col"
              : "min-w-full w-max [&>code]:flex [&>code]:flex-col",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
      {collapsedHeight && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center gap-1 w-full py-1.5 text-xs text-muted-foreground hover:text-foreground border-t cursor-pointer transition-colors"
        >
          <ChevronDown className="size-3.5" />
          {t("code.expand")}
        </button>
      )}
    </figure>
  )
}

// html.highlight names the language in a class of the `<code>` inside `<pre>`
function readLanguage(children: ReactNode) {
  if (!isValidElement<{ className?: string }>(children)) return undefined
  return children.props.className?.match(/\blanguage-(\S+)/)?.[1]
}
