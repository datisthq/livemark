import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { sortedArticles } from "../helpers/articles.ts"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const first = sortedArticles[0]
    if (!first) throw notFound()
    throw redirect({ to: "/$path", params: { path: first._meta.path } })
  },
})
