import { config } from "livemark:virtual"
import { createFileRoute } from "@tanstack/react-router"
import { sectionFlatArticles, sortedArticles } from "../content/article.ts"
import { renderRssFeed, type RssItem } from "../helpers/rss.ts"

const FEED_ITEM_LIMIT = 20

export const Route = createFileRoute("/$section/rss.xml")({
  server: {
    handlers: {
      GET: async ({ params }: { params: { section: string } }) => {
        if (!config.site) {
          return new Response("RSS requires `site` in livemark.config.ts", {
            status: 404,
          })
        }
        const prefix = `/${params.section}/`
        const section = config.sections?.find(
          s => s.type === "blog" && s.prefix === prefix,
        )
        if (!section || section.type !== "blog") {
          return new Response("Not found", { status: 404 })
        }
        const host = config.site.replace(/\/+$/, "")
        const base = config.base ?? ""
        const toAbsolute = (path: string) => `${host}${base}${path}`

        const paths = sectionFlatArticles.get(section.prefix) ?? []
        const items: RssItem[] = []
        for (const path of paths) {
          if (items.length >= FEED_ITEM_LIMIT) break
          const article = sortedArticles.find(a => a.path === path)
          if (!article?.date) continue
          const link = toAbsolute(article.path)
          items.push({
            title: article.title,
            link,
            guid: link,
            description: article.description,
            pubDate: article.date,
            author: article.author,
            categories: article.tags,
          })
        }

        const xml = renderRssFeed({
          title: section.siteTitle ?? section.title,
          description: section.siteDescription ?? config.description ?? "",
          link: toAbsolute(section.prefix),
          feedLink: toAbsolute(`${section.prefix}rss.xml`),
          items,
        })

        return new Response(xml, {
          headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
        })
      },
    },
  },
})
