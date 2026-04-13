import { useState, useCallback } from "react"
import { Pencil, Copy, Check, ExternalLink } from "lucide-react"

/** Toolbar with action buttons displayed for the article content */
export function PageToolbar(props: { filePath: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(props.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [props.content])

  const handleOpenIn = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(props.content)
      window.open(url, "_blank", "noopener,noreferrer")
    },
    [props.content],
  )

  const buttonClass =
    "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 text-sm">
        <p className="text-sm font-medium mb-1">Actions</p>
        <a
          href={`https://github.com/datisthq/livemark/edit/main/${props.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <Pencil className="size-3.5" />
          Edit on GitHub
        </a>
        <button type="button" onClick={handleCopy} className={buttonClass}>
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          Copy Markdown
        </button>
        <button
          type="button"
          onClick={() => handleOpenIn("https://chatgpt.com/")}
          className={buttonClass}
        >
          <ExternalLink className="size-3.5" />
          Open in ChatGPT
        </button>
        <button
          type="button"
          onClick={() => handleOpenIn("https://claude.ai/")}
          className={buttonClass}
        >
          <ExternalLink className="size-3.5" />
          Open in Claude
        </button>
      </div>
    </>
  )
}
