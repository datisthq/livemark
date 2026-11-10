import { useState, useCallback } from "react"
import { Eye, Pencil, Copy, Check, ExternalLink } from "lucide-react"
import { useMessages } from "../hooks/site.ts"

/** Toolbar with action buttons displayed for the article content */
export function PageToolbar(props: {
  sourceUrl?: string
  sourceAction?: "edit" | "view"
  content: string
}) {
  const [copied, setCopied] = useState(false)
  const t = useMessages()
  const isView = props.sourceAction === "view"
  const sourceLabel = isView ? t("page.view") : t("page.edit")
  const SourceIcon = isView ? Eye : Pencil

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(props.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [props.content])

  const openIn = (base: string, extra?: Record<string, string>) => {
    const q = t("page.llmPrompt", { url: window.location.href })
    const params = new URLSearchParams({ ...extra, q })
    window.open(`${base}?${params}`, "_blank", "noopener,noreferrer")
  }

  const buttonClass =
    "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"

  return (
    <>
      <div data-slot="page-toolbar" className="flex flex-col gap-2 text-sm">
        {props.sourceUrl ? (
          <a
            href={props.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-slot="page-action"
            className={buttonClass}
          >
            <SourceIcon className="size-3.5" />
            {sourceLabel}
          </a>
        ) : (
          <span
            data-slot="page-action"
            className={`${buttonClass} opacity-50 cursor-not-allowed hover:text-muted-foreground`}
            aria-disabled="true"
          >
            <SourceIcon className="size-3.5" />
            {sourceLabel}
          </span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          data-slot="page-action"
          className={buttonClass}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {t("page.copyMarkdown")}
        </button>
        <button
          type="button"
          onClick={() => openIn("https://chatgpt.com/", { hints: "search" })}
          data-slot="page-action"
          className={buttonClass}
        >
          <ExternalLink className="size-3.5" />
          {t("page.openChatGpt")}
        </button>
        <button
          type="button"
          onClick={() => openIn("https://claude.ai/new")}
          data-slot="page-action"
          className={buttonClass}
        >
          <ExternalLink className="size-3.5" />
          {t("page.openClaude")}
        </button>
      </div>
    </>
  )
}
