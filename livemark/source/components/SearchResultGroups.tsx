import { CommandGroup, CommandItem } from "../elements/command.tsx"
import { resolveArticleIcon } from "../helpers/article-icon.ts"
import type { SearchResult } from "../helpers/article-search.ts"
import { buildHighlightPattern, findTextMatches } from "../helpers/search-highlight.ts"

export function SearchResultGroups(props: {
  query: string
  grouped: Map<string, SearchResult[]>
  onSelect: (path: string) => void
}) {
  return [...props.grouped.entries()].map(([group, items]) => (
    <CommandGroup key={group} heading={group}>
      {items.map(result => {
        const Icon = resolveArticleIcon(result.icon)
        return (
          <CommandItem
            key={result.path}
            value={result.path}
            onSelect={() => props.onSelect(result.path)}
            className="py-2.5"
          >
            {Icon && <Icon className="size-5 shrink-0 mt-0.5 self-start opacity-60" />}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-base font-medium">{result.title}</span>
              {result.snippet && (
                <span className="text-sm text-muted-foreground line-clamp-1">
                  <HighlightedText text={result.snippet} term={props.query} />
                </span>
              )}
            </div>
          </CommandItem>
        )
      })}
    </CommandGroup>
  ))
}

function HighlightedText(props: { text: string; term: string }) {
  const pattern = buildHighlightPattern(props.term)
  if (!pattern) return <>{props.text}</>
  const parts: React.ReactNode[] = []
  let cursor = 0
  for (const [start, end] of findTextMatches(props.text, pattern)) {
    parts.push(props.text.slice(cursor, start))
    parts.push(
      <span key={start} className="text-foreground font-medium">
        {props.text.slice(start, end)}
      </span>,
    )
    cursor = end
  }
  parts.push(props.text.slice(cursor))
  return <>{parts}</>
}
