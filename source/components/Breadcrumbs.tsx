import { Link, useLocation, useMatches } from "@tanstack/react-router"
import { currentSection } from "../content/article.ts"
import { useSite } from "../hooks/site.ts"

export function Breadcrumbs() {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const loaderData = last?.loaderData as { title?: string } | undefined
  const pathname = useLocation({ select: l => l.pathname })
  const section = currentSection(`/${pathname.replace(/^\/|\/$/g, "")}/`)
  const site = useSite()
  const home = site.language.prefix.replace(/^\/|\/$/g, "")

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link
        to={home ? "/$" : "/"}
        params={home ? { _splat: home } : {}}
        className="hover:text-foreground transition-colors"
      >
        {section?.title ?? site.config.title}
      </Link>
      <span>/</span>
      {loaderData?.title && (
        <span className="text-foreground font-medium">{loaderData.title}</span>
      )}
    </nav>
  )
}
