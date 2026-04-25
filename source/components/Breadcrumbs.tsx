import { Link, useLocation, useMatches } from "@tanstack/react-router"
import { currentSection } from "../content/article.ts"

export function Breadcrumbs() {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const loaderData = last?.loaderData as { title?: string } | undefined
  const pathname = useLocation({ select: l => l.pathname })
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        {section?.title ?? import.meta.env.CONFIG.title}
      </Link>
      <span>/</span>
      {loaderData?.title && (
        <span className="text-foreground font-medium">{loaderData.title}</span>
      )}
    </nav>
  )
}
