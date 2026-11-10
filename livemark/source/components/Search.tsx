import { Suspense, lazy, useRef, useState } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Search as SearchIcon } from "lucide-react"
import { cn } from "cn"
import { holdTypedKeys } from "../helpers/typed-keys.ts"
import { isMobileNow } from "../hooks/media.ts"
import { useMessages } from "../hooks/site.ts"

// Orama, cmdk and the dialog load on first use, not with every page
const importHeaderSearch = () => import("./HeaderSearch.tsx")
const importSearchDialog = () => import("./SearchDialog.tsx")
const HeaderSearch = lazy(() =>
  importHeaderSearch().then(m => ({ default: m.HeaderSearch })),
)
const SearchDialog = lazy(() =>
  importSearchDialog().then(m => ({ default: m.SearchDialog })),
)

/** Search button with "S" and Ctrl/⌘+K keyboard shortcuts: a command palette from `lg`, an in-header field below.
 * `compact` keeps it an icon from `lg` too, when header sections need the room */
export function Search(props: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [headerOpen, setHeaderOpen] = useState(false)
  // Mounted from the first open on, so later closes keep their exit animation
  const [dialogUsed, setDialogUsed] = useState(false)
  const t = useMessages()
  const heldKeys = useRef<ReturnType<typeof holdTypedKeys>>(undefined)
  const takeTypedKeys = () => {
    const typed = heldKeys.current?.release() ?? ""
    heldKeys.current = undefined
    return typed
  }
  const openSearch = () => {
    heldKeys.current?.release()
    heldKeys.current = holdTypedKeys()
    if (isMobileNow()) return setHeaderOpen(true)
    setDialogUsed(true)
    setOpen(true)
  }
  const preloadSearch = () => {
    void (isMobileNow() ? importHeaderSearch() : importSearchDialog())
  }

  useHotkey("S", openSearch)
  useHotkey("Mod+K", openSearch)

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        onPointerEnter={preloadSearch}
        onFocus={preloadSearch}
        aria-label={t("search.label")}
        aria-keyshortcuts="S"
        title={t("search.label")}
        className={cn(
          "flex h-9 items-center gap-2 rounded-control border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer",
          !props.compact && "lg:w-40 xl:w-auto xl:min-w-0 xl:flex-1",
        )}
      >
        <SearchIcon className="size-4" />
        <span
          className={cn(
            "hidden flex-1 truncate text-left",
            !props.compact && "lg:inline",
          )}
        >
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
      <Suspense>
        {headerOpen && (
          <HeaderSearch
            onClose={() => setHeaderOpen(false)}
            takeTypedKeys={takeTypedKeys}
          />
        )}
        {dialogUsed && (
          <SearchDialog
            open={open}
            onOpenChange={setOpen}
            takeTypedKeys={takeTypedKeys}
          />
        )}
      </Suspense>
    </>
  )
}
