import { sites } from "livemark:virtual"
import { renderRssFeed, type RssItem } from "../helpers/rss.ts"
import { currentSite, sectionFlatArticles, sortedArticles } from "./article.ts"

const FEED_ITEM_LIMIT = 20

/** Respond with the RSS feed of the blog section at `prefix`, in its language. */
export function respondWithFeed(prefix: string) {
  const config = sites[0].config
  if (!config.site) {
    return new Response("RSS requires `site` in livemark.config.ts", {
      status: 404,
    })
  }
  const site = currentSite(prefix)
  const section = site.config.sections?.find(
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
    description: section.siteDescription ?? site.config.description ?? "",
    link: toAbsolute(section.prefix),
    feedLink: toAbsolute(`${section.prefix}rss.xml`),
    items,
  })

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
