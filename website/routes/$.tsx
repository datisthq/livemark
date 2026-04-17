import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import {
  currentSection,
  firstArticle,
  homeArticle,
  sortedArticles,
} from "../content/article.ts"
import { sectionTags } from "../content/tag.ts"
import { Article } from "../components/Article.tsx"
import { BlogIndex } from "../components/BlogIndex.tsx"
import { TagIndex } from "../components/TagIndex.tsx"

export const Route = createFileRoute("/$")({
  loader: ({ params }) => {
    if (!params._splat) {
      if (homeArticle) return { ...homeArticle, sidebar: homeArticle.sidebar }
      if (!firstArticle) throw notFound()
      throw redirect({
        to: "/$",
        params: { _splat: firstArticle.pathname.replace(/^\/|\/$/g, "") },
      })
    }
    const splat = `/${params._splat}/`
    const article = sortedArticles.find(a => a.pathname === splat)
    if (article) return article

    const section = currentSection(splat)
    if (section?.type === "blog") {
      if (section.pathname === splat) {
        return {
          blogIndex: true as const,
          sectionPathname: section.pathname,
          title: section.title,
          sidebar: true,
        }
      }

      const tagMatch = splat.match(
        new RegExp(`^${section.pathname}tags/([^/]+)/$`),
      )
      const tag = tagMatch?.[1]
      if (tag) {
        const tagMap = sectionTags.get(section.pathname)
        if (tagMap?.has(tag)) {
          return {
            tagPage: true as const,
            sectionPathname: section.pathname,
            tag,
            title: `Posts tagged '${tag}'`,
            sidebar: true,
          }
        }
      }
    }

    throw notFound()
  },
  head: ({ loaderData }) => ({
    meta: [
      ...(loaderData ? [{ title: loaderData.title }] : []),
      ...("description" in loaderData && loaderData.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
  }),
  component: Component,
})

function Component() {
  const data = Route.useLoaderData()
  if ("blogIndex" in data) {
    return <BlogIndex sectionPathname={data.sectionPathname} />
  }
  if ("tagPage" in data) {
    return <TagIndex sectionPathname={data.sectionPathname} tag={data.tag} />
  }
  return <Article article={data} />
}
