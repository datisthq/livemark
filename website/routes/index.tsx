import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { sortedArticles } from "../content/article.ts"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const first = sortedArticles[0]
    if (!first) throw notFound()
    throw redirect({
      to: "/$",
      params: { _splat: first.pathname.replace(/^\/|\/$/g, "") },
    })
  },
})
