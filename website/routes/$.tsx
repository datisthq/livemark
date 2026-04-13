import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import {
  firstArticle,
  homeArticle,
  sortedArticles,
} from "../content/article.ts"
import { Article } from "../components/Article.tsx"

export const Route = createFileRoute("/$")({
  loader: ({ params }) => {
    if (!params._splat) {
      if (homeArticle) return homeArticle
      if (!firstArticle) throw notFound()
      throw redirect({
        to: "/$",
        params: { _splat: firstArticle.pathname.replace(/^\/|\/$/g, "") },
      })
    }
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
      ...(loaderData?.image
        ? [{ property: "og:image", content: loaderData.image }]
        : []),
      ...(loaderData?.author
        ? [
            {
              name: "author",
              content: Array.isArray(loaderData.author)
                ? loaderData.author.join(", ")
                : loaderData.author,
            },
          ]
        : []),
      ...(loaderData?.date
        ? [{ property: "article:published_time", content: loaderData.date }]
        : []),
    ],
  }),
  component: Component,
})

function Component() {
  const article = Route.useLoaderData()
  return <Article article={article} />
}
