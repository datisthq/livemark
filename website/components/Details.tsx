import { ChevronRight } from "lucide-react"

/** Collapsible content section with a summary label */
export function Details(props: { summary: string; children: React.ReactNode }) {
  return (
    <details className="not-prose group my-4 rounded-xl border border-border bg-card px-4 py-3">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold select-none list-none [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
        {props.summary}
      </summary>
      <div className="mt-3 text-sm [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {props.children}
      </div>
    </details>
  )
}
