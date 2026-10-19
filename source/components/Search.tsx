import { useState } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Search as SearchIcon } from "lucide-react"
import { isMobileNow } from "../hooks/media.ts"
import { HeaderSearch } from "./HeaderSearch.tsx"
import { SearchDialog } from "./SearchDialog.tsx"

/** Search button with "S" keyboard shortcut: a command palette from `lg`, an in-header field below */
export function Search() {
  const [open, setOpen] = useState(false)
  const [headerOpen, setHeaderOpen] = useState(false)
  const openSearch = () => (isMobileNow() ? setHeaderOpen(true) : setOpen(true))

  useHotkey("S", openSearch)

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        aria-keyshortcuts="S"
        title="Search"
        className="flex h-9 items-center gap-2 rounded-control border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer lg:w-56"
      >
        <SearchIcon className="size-4" />
        <span className="hidden flex-1 text-left lg:inline">Search...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono lg:inline">
          S
        </kbd>
      </button>
      {headerOpen && <HeaderSearch onClose={() => setHeaderOpen(false)} />}
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
