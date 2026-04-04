import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { allArticles } from "content-collections"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    console.log(allArticles)
    const first = allArticles[0]
    if (!first) throw notFound()
    throw redirect({ to: "/$path", params: { path: first._meta.path } })
  },
})
