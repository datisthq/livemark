import { describe, expect, it } from "vite-plus/test"
import type { WebsiteConfig } from "../models/config.ts"
import { buildPageHead, buildRootHead } from "./head.ts"
import { resolveLanguages } from "./site.ts"

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
    expect(head.links).toEqual([
      { rel: "alternate", type: "text/markdown", href: "/guide/index.md" },
    ])
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

  it("links every language's version with hreflang and an x-default", () => {
    const [en, es] = resolveLanguages([
      { code: "en", label: "English" },
      { code: "es", label: "Español", locale: "es-ES" },
    ])
    const head = buildPageHead({
      config: { ...config, site: "https://x.dev" },
      path: "/es/guide/",
      language: es,
      alternates: es
        ? [
            { language: en, path: "/guide/" },
            { language: es, path: "/es/guide/" },
          ]
        : [],
      title: "Guía",
    })
    expect(head.links).toContainEqual({
      rel: "alternate",
      hrefLang: "es-ES",
      href: "https://x.dev/es/guide/",
    })
    expect(head.links).toContainEqual({
      rel: "alternate",
      hrefLang: "x-default",
      href: "https://x.dev/guide/",
    })
    expect(head.meta).toContainEqual({ property: "og:locale", content: "es_ES" })
  })

  it("adds no language tags without a language", () => {
    const head = buildPageHead({ config, path: "/guide/", title: "Guide" })
    expect(head.meta.some(m => "property" in m && m.property === "og:locale")).toBe(false)
    expect(head.meta.some(m => "name" in m && m.name === "description")).toBe(false)
  })

  it("points canonical and the Markdown twin at canonicalPath", () => {
    const head = buildPageHead({
      config: { ...config, site: "https://x.dev" },
      path: "/es/changelog/1-0-0/",
      canonicalPath: "/changelog/1-0-0/",
      isArticle: true,
    })
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: "https://x.dev/changelog/1-0-0/",
    })
    expect(head.links).toContainEqual({
      rel: "alternate",
      type: "text/markdown",
      href: "/changelog/1-0-0/index.md",
    })
  })
})
