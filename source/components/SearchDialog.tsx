import { useArticleSearch } from "../helpers/article-search.ts"
import { SearchResultGroups } from "./SearchResultGroups.tsx"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../elements/command.tsx"

/** Full-text search dialog powered by Orama */
export function SearchDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const search = useArticleSearch()

  return (
    <CommandDialog
      title="Search"
      description="Search documentation"
      open={props.open}
      onOpenChange={props.onOpenChange}
      shouldFilter={false}
      loop
    >
      <CommandInput
        placeholder="Search docs..."
        value={search.query}
        onValueChange={search.searchArticles}
        onClear={() => search.searchArticles("")}
      />
      <CommandList className="max-h-80">
        <CommandEmpty>
          {search.query.trim()
            ? "No results found."
            : "Type to search across all contents."}
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
          navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            ↵
          </kbd>
          select
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono">
            esc
          </kbd>
          close
        </span>
      </div>
    </CommandDialog>
  )
}
