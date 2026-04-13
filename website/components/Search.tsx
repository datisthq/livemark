import { useState } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Search as SearchIcon } from "lucide-react"
import { SearchDialog } from "./SearchDialog.tsx"

/** Search button with "/" keyboard shortcut and command palette dialog */
export function Search() {
  const [open, setOpen] = useState(false)

  useHotkey("/", () => setOpen(true))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-sidebar-accent/70 px-3 py-2 text-sm text-muted-foreground shadow-xs hover:bg-background transition-colors cursor-pointer"
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          /
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
