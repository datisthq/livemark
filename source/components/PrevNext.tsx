import { Link, useNavigate } from "@tanstack/react-router"
import { useHotkey } from "@tanstack/react-hotkeys"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  sortedArticles,
  currentSection,
  languageFlatArticles,
  sectionFlatArticles,
} from "../content/article.ts"
import { useMessages, useSite } from "../hooks/site.ts"

/** Previous/next article navigation shown at the bottom of each article page */
export function PrevNext(props: { path: string }) {
  const t = useMessages()
  const flatArticles = languageFlatArticles.get(useSite().language.code) ?? []
  const section = currentSection(props.path)
  const flat = section
    ? (sectionFlatArticles.get(section.prefix) ?? flatArticles)
    : flatArticles
  const index = flat.indexOf(props.path)
  const prevPath = index > 0 ? flat[index - 1] : undefined
  const nextPath = index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined
  const prev = prevPath ? sortedArticles.find(a => a.path === prevPath) : undefined
  const next = nextPath ? sortedArticles.find(a => a.path === nextPath) : undefined

  const navigate = useNavigate()
  const goTo = (path: string) =>
    navigate({ to: "/$", params: { _splat: path.replace(/^\/|\/$/g, "") } })
  useHotkey("H", () => prev && goTo(prev.path))
  useHotkey("L", () => next && goTo(next.path))

  if (!prev && !next) return null

  return (
    <nav className="not-prose mt-10 flex gap-4">
      {prev && (
        <Link
          to="/$"
          params={{ _splat: prev.path.replace(/^\/|\/$/g, "") }}
          aria-keyshortcuts="H"
          className="flex-1 rounded-card border shadow-sm p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" />
            {t("nav.previous")}
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link
          to="/$"
          params={{ _splat: next.path.replace(/^\/|\/$/g, "") }}
          aria-keyshortcuts="L"
          className="flex-1 rounded-card border shadow-sm p-4 hover:bg-muted/50 transition-colors text-right"
        >
          <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
            {t("nav.next")}
            <ChevronRight className="size-4" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
