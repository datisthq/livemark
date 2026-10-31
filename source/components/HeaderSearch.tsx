import { useLayoutEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { useArticleSearch } from "../helpers/article-search.ts"
import { SearchResultGroups } from "./SearchResultGroups.tsx"
import { Command, CommandEmpty, CommandInput, CommandList } from "../elements/command.tsx"
import { useMessages } from "../hooks/site.ts"

/** Search field that takes over the header below `lg`, with results dropping under it */
export function HeaderSearch(props: {
  onClose: () => void
  takeTypedKeys: () => string
}) {
  const search = useArticleSearch()
  const bar = useRef<HTMLDivElement>(null)
  const [panelTop, setPanelTop] = useState<number>()
  const t = useMessages()

  // Measured, not `top-16`: while the Banner is in view it pushes the header down.
  useLayoutEffect(() => {
    const measure = () => setPanelTop(bar.current?.getBoundingClientRect().bottom)
    measure()
    window.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", measure)
      window.removeEventListener("resize", measure)
    }
  }, [])

  // `data-header-search` lifts the header over the Toc bar and BackToTop (Layout).
  return (
    <Command
      ref={bar}
      data-header-search
      shouldFilter={false}
      loop
      onKeyDown={event => {
        if (event.key === "Escape") props.onClose()
      }}
      className="absolute inset-0 z-10 overflow-visible rounded-none! bg-background p-0 lg:hidden"
    >
      <div className="flex h-full items-center gap-1 pl-1 pr-2">
        <div className="flex-1 [&_[data-slot=command-input-wrapper]]:p-0 [&_[data-slot=input-group]]:border-transparent! [&_[data-slot=input-group]]:bg-transparent! [&_[data-slot=input-group]]:ring-0!">
          <CommandInput
            autoFocus
            placeholder={t("search.placeholder")}
            value={search.query}
            onValueChange={search.searchArticles}
            onFocus={() => {
              const typed = props.takeTypedKeys()
              if (typed) search.searchArticles(search.query + typed)
            }}
          />
        </div>
        <button
          type="button"
          onClick={props.onClose}
          aria-label={t("search.close")}
          title={t("search.close")}
          className="flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>
      <div
        style={{ top: panelTop }}
        className="fixed inset-x-0 bottom-0 flex flex-col border-t bg-background p-1"
      >
        <CommandList className="max-h-none flex-1 overscroll-contain">
          <CommandEmpty>
            {search.query.trim() ? t("search.empty") : t("search.hint")}
          </CommandEmpty>
          <SearchResultGroups
            query={search.query}
            grouped={search.grouped}
            onSelect={path => {
              props.onClose()
              search.selectArticle(path)
            }}
          />
        </CommandList>
      </div>
    </Command>
  )
}
