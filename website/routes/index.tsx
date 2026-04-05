import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { sortedArticles } from "../helpers/articles.ts"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const first = sortedArticles[0]
    if (!first) throw notFound()
    throw redirect({ to: "/$pathname", params: { pathname: first.pathname } })
  },
})
