import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { allArticles } from "content-collections"

export const Route = createFileRoute("/$path")({
  loader: ({ params }) => {
    const article = allArticles.find(a => a._meta.path === params.path)
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

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        {article.description && (
          <p className="text-muted-foreground mb-8">{article.description}</p>
        )}
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent code={article.mdx} />
        </div>
      </div>
    </div>
  )
}
