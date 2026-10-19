import { describe, expect, it } from "vite-plus/test"
import type { WebsiteConfig } from "../models/config.ts"
import { buildPageHead, buildRootHead } from "./head.ts"

const config: WebsiteConfig = { title: "Docs", description: "Blurb" }

describe("buildRootHead", () => {
  it("builds the default site tags", () => {
    const head = buildRootHead({
      config,
      defaultFavicon: "/logo.svg",
      stylesheets: ["/a.css"],
    })
    expect(head.meta).toContainEqual({ property: "og:title", content: "Docs" })
    expect(head.links).toContainEqual({
      rel: "icon",
      href: "/logo.svg",
      type: "image/svg+xml",
    })
    expect(head.links).toContainEqual({ rel: "stylesheet", href: "/a.css" })
    expect(head.scripts).toHaveLength(1)
  })

  it("appends config head tags after the defaults", () => {
    const head = buildRootHead({
      config: {
        ...config,
        head: {
          meta: [{ property: "og:type", content: "book" }],
          links: [{ rel: "me", href: "https://x.com/me" }],
          scripts: [{ src: "https://cdn.example.com/a.js" }],
        },
      },
      defaultFavicon: "/logo.svg",
      stylesheets: [],
    })
    expect(head.meta.at(-1)).toEqual({ property: "og:type", content: "book" })
    expect(head.links.at(-1)).toEqual({ rel: "me", href: "https://x.com/me" })
    expect(head.scripts.at(-1)).toEqual({ src: "https://cdn.example.com/a.js" })
  })

  it("links blog feeds only when site is set", () => {
    const sections: WebsiteConfig["sections"] = [
      { type: "blog", title: "Blog", prefix: "/blog/", position: "header" },
    ]
    const withoutSite = buildRootHead({
      config: { ...config, sections },
      defaultFavicon: "/logo.svg",
      stylesheets: [],
    })
    const withSite = buildRootHead({
      config: { ...config, sections, site: "https://example.com", base: "/repo" },
      defaultFavicon: "/logo.svg",
      stylesheets: [],
    })
    expect(withoutSite.links.some(l => l.rel === "alternate")).toBe(false)
    expect(withSite.links).toContainEqual({
      rel: "alternate",
      type: "application/rss+xml",
      title: "Blog RSS Feed",
      href: "/repo/blog/rss.xml",
    })
  })
})

describe("buildPageHead", () => {
  it("emits title, description and article type", () => {
    const head = buildPageHead({
      config,
      path: "/guide/",
      title: "Guide",
      description: "How to",
      isArticle: true,
    })
    expect(head.meta).toEqual([
      { title: "Guide" },
      { property: "og:title", content: "Guide" },
      { name: "description", content: "How to" },
      { property: "og:description", content: "How to" },
      { property: "og:type", content: "article" },
    ])
    expect(head.links).toEqual([])
  })

  it("adds absolute url, canonical and image when site is set", () => {
    const head = buildPageHead({
      config: { ...config, site: "https://example.com/", base: "/repo" },
      path: "/guide/",
      image: "/repo/assets/cover.png",
    })
    expect(head.meta).toEqual([
      { property: "og:url", content: "https://example.com/repo/guide/" },
      { property: "og:image", content: "https://example.com/repo/assets/cover.png" },
    ])
    expect(head.links).toEqual([
      { rel: "canonical", href: "https://example.com/repo/guide/" },
    ])
  })

  it("keeps an already absolute image", () => {
    const head = buildPageHead({
      config: { ...config, site: "https://example.com" },
      path: "/",
      image: "https://cdn.example.com/cover.png",
    })
    expect(head.meta).toContainEqual({
      property: "og:image",
      content: "https://cdn.example.com/cover.png",
    })
  })

  it("skips og:image without site", () => {
    const head = buildPageHead({ config, path: "/", image: "/cover.png" })
    expect(head.meta).toEqual([])
  })
})
