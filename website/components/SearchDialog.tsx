import { useState, useRef, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { create, insertMultiple, search } from "@orama/orama"
import { sortedArticles } from "../helpers/articles.ts"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../elements/command.tsx"

type SearchResult = { title: string; pathname: string; description: string }

/** Full-text search dialog powered by Orama */
export function SearchDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [results, setResults] = useState<SearchResult[]>([])
  const dbRef = useRef<Awaited<ReturnType<typeof create>> | null>(null)
  const navigate = useNavigate()

  const ensureIndex = useCallback(async () => {
    if (dbRef.current) return dbRef.current
    const db = await create({
      schema: {
        title: "string",
        description: "string",
        searchText: "string",
      },
    })
    await insertMultiple(
      db,
      sortedArticles.map(a => ({
        title: a.title,
        description: a.description ?? "",
        searchText: a.searchText,
      })),
    )
    dbRef.current = db
    return db
  }, [])

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults(
          sortedArticles.map(a => ({
            title: a.title,
            pathname: a.pathname,
            description: a.description ?? "",
          })),
        )
        return
      }
      const db = await ensureIndex()
      const hits = await search(db, {
        term,
        properties: ["title", "description", "searchText"],
        tolerance: 1,
        boost: { title: 3, description: 2 },
      })
      setResults(
        hits.hits.map(hit => {
          const article = sortedArticles.find(
            a => a.title === hit.document.title,
          )
          return {
            title: hit.document.title,
            pathname: article?.pathname ?? "",
            description: hit.document.description,
          }
        }),
      )
    },
    [ensureIndex],
  )

  const handleSelect = useCallback(
    (pathname: string) => {
      props.onOpenChange(false)
      navigate({
        to: "/$",
        params: { _splat: pathname.replace(/^\/|\/$/g, "") },
      })
    },
    [navigate, props.onOpenChange],
  )

  return (
    <CommandDialog
      title="Search"
      description="Search documentation"
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search docs..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.map(result => (
            <CommandItem
              key={result.pathname}
              value={result.pathname}
              onSelect={() => handleSelect(result.pathname)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{result.title}</span>
                {result.description && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {result.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
