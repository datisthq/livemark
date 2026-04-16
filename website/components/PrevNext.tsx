import { Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  sortedArticles,
  flatArticles,
  currentSection,
  sectionFlatArticles,
} from "../content/article.ts"

/** Previous/next article navigation shown at the bottom of each article page */
export function PrevNext(props: { pathname: string }) {
  const section = currentSection(props.pathname)
  const flat = section
    ? (sectionFlatArticles.get(section.pathname) ?? flatArticles)
    : flatArticles
  const index = flat.indexOf(props.pathname)
  if (index < 0) return null

  const prevPath = index > 0 ? flat[index - 1] : undefined
  const nextPath = index < flat.length - 1 ? flat[index + 1] : undefined
  const prev = prevPath
    ? sortedArticles.find(a => a.pathname === prevPath)
    : undefined
  const next = nextPath
    ? sortedArticles.find(a => a.pathname === nextPath)
    : undefined

  if (!prev && !next) return null

  return (
    <nav className="not-prose mt-10 flex gap-4">
      {prev && (
        <Link
          to="/$"
          params={{ _splat: prev.pathname.replace(/^\/|\/$/g, "") }}
          className="flex-1 rounded-xl border shadow-sm p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" />
            Previous
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link
          to="/$"
          params={{ _splat: next.pathname.replace(/^\/|\/$/g, "") }}
          className="flex-1 rounded-xl border shadow-sm p-4 hover:bg-muted/50 transition-colors text-right"
        >
          <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
            Next
            <ChevronRight className="size-4" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
