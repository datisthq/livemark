import { Link, useMatches } from "@tanstack/react-router"

export function Breadcrumbs() {
  const matches = useMatches()
  const last = matches[matches.length - 1]
  const loaderData = last?.loaderData as { title?: string } | undefined

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      <span>/</span>
      {loaderData?.title && (
        <span className="text-foreground font-medium">{loaderData.title}</span>
      )}
    </nav>
  )
}
