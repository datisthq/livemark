import { createFileRoute, notFound } from "@tanstack/react-router"
import { sortedArticles } from "../content/article.ts"
import { Article } from "../components/Article.tsx"

export const Route = createFileRoute("/$")({
  loader: ({ params }) => {
    const splat = `/${params._splat}/`
    const article = sortedArticles.find(a => a.pathname === splat)
    if (!article) throw notFound()
    return article
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
