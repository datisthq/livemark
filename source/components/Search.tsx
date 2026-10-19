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
        aria-label="Search"
        title="Search"
        className="flex h-9 items-center gap-2 rounded-control border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer sm:w-56"
      >
        <SearchIcon className="size-4" />
        <span className="hidden flex-1 text-left sm:inline">Search...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono sm:inline">
          /
        </kbd>
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
