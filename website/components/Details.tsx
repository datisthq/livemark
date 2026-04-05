import { useState } from "react"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../elements/collapsible.tsx"

/** Collapsible content section with a summary label */
export function Details(props: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="not-prose my-4 rounded-xl border border-border bg-card px-4 py-3"
    >
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 text-sm font-semibold select-none">
        <ChevronRight
          className={`size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        />
        {props.summary}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 text-sm [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {props.children}
      </CollapsibleContent>
    </Collapsible>
  )
}
