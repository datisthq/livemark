import { useState, useRef, useCallback, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { create, insertMultiple, search } from "@orama/orama"
import { sortedArticles } from "../content/article.ts"
import { resolveArticleIcon } from "./article-icon.ts"
import { CommandGroup, CommandItem } from "../elements/command.tsx"

interface SearchResult {
  title: string
  path: string
  icon?: string
  snippet: string
  group: string
}

export function useArticleSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [query, setQuery] = useState("")
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

  const searchArticles = useCallback(
    async (term: string) => {
      setQuery(term)
      if (!term.trim()) {
        setResults([])
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
          const article = sortedArticles.find(a => a.title === hit.document.title)
          if (!article)
            return toResult(
              {
                ...sortedArticles[0],
                title: hit.document.title,
                path: "",
                searchText: hit.document.description,
                description: hit.document.description,
                icon: "",
              },
              term,
            )
          return toResult(article, term)
        }),
      )
    },
    [ensureIndex],
  )

  const selectArticle = useCallback(
    (path: string) => {
      setQuery("")
      setResults([])
      navigate({
        to: "/$",
        params: { _splat: path.replace(/^\/|\/$/g, "") },
      })
    },
    [navigate],
  )

  const grouped = useMemo(() => {
    const groups = new Map<string, SearchResult[]>()
    for (const r of results) {
      const list = groups.get(r.group) ?? []
      list.push(r)
      groups.set(r.group, list)
    }
    return groups
  }, [results])

  return { query, grouped, searchArticles, selectArticle }
}

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

function toResult(article: (typeof sortedArticles)[number], term: string): SearchResult {
  return {
    title: article.title,
    path: article.path,
    icon: article.icon,
    snippet: term
      ? extractSnippet(article.searchText, term)
      : (article.description ?? ""),
    group: groupFor(article.path),
  }
}

function groupFor(pathname: string) {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/")
  if (segments.length <= 2) return "Pages"
  return segments
    .slice(1, -1)
    .map(s =>
      s
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    )
    .join(" › ")
}

function extractSnippet(text: string, term: string) {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(term.toLowerCase())
  if (idx === -1) return text.slice(0, 120)
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + term.length + 80)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < text.length ? "…" : ""
  return `${prefix}${text.slice(start, end)}${suffix}`
}

function HighlightedText(props: { text: string; term: string }) {
  if (!props.term.trim()) return <>{props.text}</>
  const escaped = props.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = props.text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-foreground font-medium">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
