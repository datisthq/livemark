import { useArticleSearch } from "../helpers/article-search.ts"
import { SearchResultGroups } from "./SearchResultGroups.tsx"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../elements/command.tsx"
import { useMessages } from "../hooks/site.ts"

/** Full-text search dialog powered by Orama */
export function SearchDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  takeTypedKeys: () => string
}) {
  const search = useArticleSearch()
  const t = useMessages()

  return (
    <CommandDialog
      title={t("search.label")}
      description={t("search.description")}
      open={props.open}
      onOpenChange={props.onOpenChange}
      shouldFilter={false}
      loop
    >
      <CommandInput
        placeholder={t("search.placeholder")}
        value={search.query}
        onValueChange={search.searchArticles}
        onFocus={() => {
          const typed = props.takeTypedKeys()
          if (typed) search.searchArticles(search.query + typed)
        }}
        onClear={() => search.searchArticles("")}
      />
      <CommandList className="max-h-80">
        <CommandEmpty>
          {search.query.trim() ? t("search.empty") : t("search.hint")}
        </CommandEmpty>
        <SearchResultGroups
          query={search.query}
          grouped={search.grouped}
          onSelect={path => {
            props.onOpenChange(false)
            search.selectArticle(path)
          }}
        />
      </CommandList>
      <div className="flex items-center gap-4 border-t mt-2 px-4 py-2.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            ↑↓
          </kbd>
          {t("search.navigate")}
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            ↵
          </kbd>
          {t("search.select")}
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            esc
          </kbd>
          {t("search.dismiss")}
        </span>
      </div>
    </CommandDialog>
  )
}
