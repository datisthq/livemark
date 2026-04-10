import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { firstArticle, homeArticle } from "../content/article.ts"
import { Article } from "../components/Article.tsx"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (homeArticle) return
    if (!firstArticle) throw notFound()
    throw redirect({
      to: "/$",
      params: { _splat: firstArticle.pathname.replace(/^\/|\/$/g, "") },
    })
  },
  loader: () => {
    if (!homeArticle) throw notFound()
    return homeArticle
  },
  head: ({ loaderData }) => ({
    meta: [
      ...(loaderData ? [{ title: loaderData.title }] : []),
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
  }),
  component: Component,
})

function Component() {
  const article = Route.useLoaderData()
  return <Article article={article} />
}
