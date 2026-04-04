import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { allArticles } from "content-collections"
import { CodeBlock } from "../components/CodeBlock.tsx"

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
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent code={article.mdx} components={{ pre: CodeBlock }} />
        </div>
      </div>
    </div>
  )
}
