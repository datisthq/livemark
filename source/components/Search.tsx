import { useState } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Search as SearchIcon } from "lucide-react"
import { cn } from "cn"
import { isMobileNow } from "../hooks/media.ts"
import { HeaderSearch } from "./HeaderSearch.tsx"
import { SearchDialog } from "./SearchDialog.tsx"
import { useMessages } from "../hooks/site.ts"

/** Search button with "S" keyboard shortcut: a command palette from `lg`, an in-header field below.
 * `compact` keeps it an icon from `lg` too, when header sections need the room */
export function Search(props: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [headerOpen, setHeaderOpen] = useState(false)
  const t = useMessages()
  const openSearch = () => (isMobileNow() ? setHeaderOpen(true) : setOpen(true))

  useHotkey("S", openSearch)

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label={t("search.label")}
        aria-keyshortcuts="S"
        title={t("search.label")}
        className={cn(
          "flex h-9 items-center gap-2 rounded-control border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer",
          !props.compact && "lg:w-32",
        )}
      >
        <SearchIcon className="size-4" />
        <span className={cn("hidden flex-1 text-left", !props.compact && "lg:inline")}>
          {t("search.button")}
        </span>
        <kbd
          className={cn(
            "hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono",
            !props.compact && "lg:inline",
          )}
        >
          S
        </kbd>
      </button>
      {headerOpen && <HeaderSearch onClose={() => setHeaderOpen(false)} />}
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
