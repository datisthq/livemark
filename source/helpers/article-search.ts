import { useState, useRef, useCallback, useMemo } from "react"
import { useNavigate } from "@tanstack/react-router"
import { create, insertMultiple, search, type Tokenizer } from "@orama/orama"
import { searchIndexes } from "livemark:articles"
import { sortedArticles } from "../content/article.ts"
import { useMessages, useSite } from "../hooks/site.ts"
import { buildHighlightPattern, findTextMatches } from "./search-highlight.ts"
import { createSearchTokenizer } from "./search-tokenizer.ts"
import { buildPathLink } from "./path-link.ts"

export interface SearchResult {
  title: string
  path: string
  icon?: string
  snippet: string
  group: string
}

export function useArticleSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [query, setQuery] = useState("")
  const indexRef = useRef<{
    language: string
    db: SearchDb
    texts: Map<string, string>
    tolerance: number
  } | null>(null)
  const navigate = useNavigate()
  const language = useSite().language.code
  const t = useMessages()
  const pagesGroup = t("search.pages")

  // Only the current language's articles, so results never cross languages; their
  // search text is its own chunk, fetched the first time someone searches.
  const ensureIndex = useCallback(async () => {
    if (indexRef.current?.language === language) return indexRef.current
    const load = searchIndexes[language]
    const entries = load ? (await load()).default : []
    const texts = new Map(entries.map(e => [e.path, e.searchText]))
    const tokenizer = createSearchTokenizer(language)
    const db = await createSearchDb(tokenizer)
    await insertMultiple(
      db,
      sortedArticles
        // A changelog copy repeats the default language's notes, which that language's
        // search text does not carry.
        .filter(a => a.language === language && !a.source)
        .map(a => ({
          // Orama keeps a document's own `id`, so a hit leads back to its article.
          id: a.path,
          title: a.title,
          description: a.description ?? "",
          searchText: texts.get(a.path) ?? "",
        })),
    )
    // A typo allowance of one character turns a two-character Chinese word into any
    // other word sharing a character.
    indexRef.current = { language, db, texts, tolerance: tokenizer ? 0 : 1 }
    return indexRef.current
  }, [language])

  const searchArticles = useCallback(
    async (term: string) => {
      setQuery(term)
      if (!term.trim()) {
        setResults([])
        return
      }
      const index = await ensureIndex()
      const hits = await search(index.db, {
        term,
        properties: ["title", "description", "searchText"],
        tolerance: index.tolerance,
        boost: { title: 3, description: 2 },
      })
      setResults(
        hits.hits.flatMap(hit => {
          const article = sortedArticles.find(a => a.path === hit.id)
          if (!article) return []
          const text = index.texts.get(article.path) ?? ""
          return [toResult(article, text, term, pagesGroup)]
        }),
      )
    },
    [ensureIndex, pagesGroup],
  )

  const selectArticle = useCallback(
    (path: string) => {
      setQuery("")
      setResults([])
      navigate({
        ...buildPathLink(path),
        search: { highlight: query.trim() || undefined },
      })
    },
    [navigate, query],
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

type SearchDb = Awaited<ReturnType<typeof createSearchDb>>

function createSearchDb(tokenizer?: Tokenizer) {
  return create({
    schema: { title: "string", description: "string", searchText: "string" },
    components: { tokenizer },
  })
}

function toResult(
  article: (typeof sortedArticles)[number],
  searchText: string,
  term: string,
  pagesGroup: string,
): SearchResult {
  return {
    title: article.title,
    path: article.path,
    icon: article.icon,
    snippet: term ? extractSnippet(searchText, term) : (article.description ?? ""),
    group: groupFor(article.key, pagesGroup),
  }
}

function groupFor(pathname: string, pagesGroup: string) {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/")
  if (segments.length <= 2) return pagesGroup
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
  const pattern = buildHighlightPattern(term)
  const [match] = pattern ? findTextMatches(text, pattern) : []
  if (!match) return text.slice(0, 120)
  const [matchStart, matchEnd] = match
  const start = Math.max(0, matchStart - 40)
  const end = Math.min(text.length, matchEnd + 80)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < text.length ? "…" : ""
  return `${prefix}${text.slice(start, end)}${suffix}`
}
