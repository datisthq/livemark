import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { allArticles } from "content-collections"
import { Content } from "../components/Content.tsx"
import { Footer } from "../components/Footer.tsx"
import { Section } from "../components/Section.tsx"

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
    <>
      <Section>
        <Content>
          <h1>{article.title}</h1>
          <MDXContent code={article.mdx} />
        </Content>
      </Section>
      <Footer />
    </>
  )
}
