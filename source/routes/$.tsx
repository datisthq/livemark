import { sites } from "livemark:virtual"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { z } from "zod"
import {
  currentSection,
  currentSite,
  firstArticle,
  homeArticle,
  languageFirstArticle,
  loadArticle,
} from "../content/article.ts"
import { sectionTags } from "../content/tag.ts"
import { listTranslations } from "../content/translation.ts"
import { buildPageHead } from "../helpers/head.ts"
import { formatMessage } from "../helpers/site.ts"
import { Article } from "../components/Article.tsx"
import { BlogIndex } from "../components/BlogIndex.tsx"
import { ChangelogIndex } from "../components/ChangelogIndex.tsx"
import { Layout } from "../components/Layout.tsx"
import { TagIndex } from "../components/TagIndex.tsx"
import { buildPathLink } from "../helpers/path-link.ts"

export const Route = createFileRoute("/$")({
  // Loose, so keys this route does not own (UTM tags, devtools flags) survive.
  validateSearch: z.looseObject({ highlight: z.string().optional().catch(undefined) }),
  loader: async ({ params }) => {
    if (!params._splat) {
      const home = homeArticle && (await loadArticle(homeArticle.path))
      if (home) return home
      if (!firstArticle) throw notFound()
      throw redirect(buildPathLink(firstArticle.path))
    }
    const splat = `/${params._splat}/`
    const article = await loadArticle(splat)
    if (article) return article

    const site = currentSite(splat)
    if (!site.language.default && site.language.prefix === splat) {
      const first = languageFirstArticle(site)
      if (!first) throw notFound()
      throw redirect(buildPathLink(first))
    }

    const section = currentSection(splat)
    if (section?.type === "changelog" && section.prefix === splat) {
      return {
        changelogIndex: true as const,
        sectionPrefix: section.prefix,
        title: section.title,
        sidebar: true,
      }
    }
    if (section?.type === "blog") {
      if (section.prefix === splat) {
        return {
          blogIndex: true as const,
          sectionPrefix: section.prefix,
          title: section.title,
          sidebar: true,
        }
      }

      const tagMatch = splat.match(new RegExp(`^${section.prefix}tags/([^/]+)/$`))
      const tag = tagMatch?.[1]
      if (tag) {
        const tagMap = sectionTags.get(section.prefix)
        if (tagMap?.has(tag)) {
          return {
            tagPage: true as const,
            sectionPrefix: section.prefix,
            tag,
            title: formatMessage(site.messages["blog.tagged"], { tag }),
            sidebar: true,
          }
        }
      }
    }

    throw notFound()
  },
  head: ({ loaderData, params }) => {
    const path = params._splat ? `/${params._splat}/` : "/"
    const site = currentSite(path)
    // A changelog copy in another language points search engines at the original.
    const source = loaderData && "source" in loaderData ? loaderData.source : undefined
    return buildPageHead({
      config: site.config,
      path,
      canonicalPath: source,
      language: sites.length > 1 ? site.language : undefined,
      alternates: sites.length > 1 && !source ? listTranslations(path) : undefined,
      title: loaderData?.title,
      description:
        loaderData && "description" in loaderData ? loaderData.description : undefined,
      image: loaderData && "image" in loaderData ? loaderData.image : undefined,
      isArticle: loaderData && "file" in loaderData,
    })
  },
  component: Component,
})

function Component() {
  const data = Route.useLoaderData()
  // Undefined for one render when HMR reloads a deleted article, before the root's
  // not-found takes over.
  if (!data) return null
  return (
    <Layout withSidebar={data.sidebar}>
      <Page />
    </Layout>
  )
}

function Page() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  if ("blogIndex" in data) {
    return <BlogIndex sectionPrefix={data.sectionPrefix} />
  }
  if ("changelogIndex" in data) {
    return <ChangelogIndex sectionPrefix={data.sectionPrefix} />
  }
  if ("tagPage" in data) {
    return <TagIndex sectionPrefix={data.sectionPrefix} tag={data.tag} />
  }
  return <Article article={data} highlight={search.highlight} />
}
