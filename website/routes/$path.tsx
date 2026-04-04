import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { sortedArticles } from "../helpers/articles.ts"
import { Callout } from "../components/Callout.tsx"
import { Card, Cards } from "../components/Cards.tsx"
import { CodeBlock } from "../components/CodeBlock.tsx"
import { headingComponents } from "../components/Heading.tsx"
import { CodeTabs } from "../components/CodeTabs.tsx"
import { Mermaid } from "../components/Mermaid.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../elements/tabs.tsx"
import { PackageTabs } from "../components/PackageTabs.tsx"
import { Toc } from "../components/Toc.tsx"
import { ZoomImage } from "../components/ZoomImage.tsx"

export const Route = createFileRoute("/$path")({
  loader: ({ params }) => {
    const article = sortedArticles.find(a => a._meta.path === params.path)
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
    <div className="flex flex-1 gap-10 p-6 md:p-10">
      <div className="flex-1 min-w-0 mx-auto max-w-3xl">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent
            code={article.mdx}
            components={{
              img: ZoomImage,
              pre: CodeBlock,
              Callout,
              Card,
              Cards,
              CodeTabs,
              Mermaid,
              PackageTabs,
              Tabs,
              TabsList,
              TabsTrigger,
              TabsContent,
              ...headingComponents,
            }}
          />
        </div>
      </div>
      <Toc items={article.toc} />
    </div>
  )
}
