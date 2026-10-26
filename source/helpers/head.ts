import type * as React from "react"
import type { WebsiteConfig } from "../models/config.ts"
import type { SiteLanguage } from "../models/language.ts"
import { faviconType } from "./favicon.ts"
import { prefixUrl } from "./prefix-url.ts"
import { buildThemeScript } from "./theme.ts"

/** Site-wide `<head>` tags the root route renders on every page. */
export interface RootHead {
  meta: Array<React.JSX.IntrinsicElements["meta"]>
  links: Array<React.JSX.IntrinsicElements["link"]>
  scripts: Array<React.JSX.IntrinsicElements["script"]>
}

export function buildRootHead(props: {
  config: WebsiteConfig
  defaultFavicon: string
  stylesheets: string[]
}) {
  const config = props.config
  const favicon = prefixUrl(
    config.favicon ?? config.logo ?? props.defaultFavicon,
    config.base,
  )
  const feedLinks = config.site
    ? (config.sections ?? [])
        .filter(s => s.type === "blog")
        .map(s => ({
          rel: "alternate",
          type: "application/rss+xml",
          title: `${s.siteTitle ?? s.title} RSS Feed`,
          href: prefixUrl(`${s.prefix}rss.xml`, config.base),
        }))
    : []
  return {
    meta: [
      { charSet: "utf-8" },
      { title: config.title },
      { name: "description", content: config.description },
      { property: "og:title", content: config.title },
      { property: "og:description", content: config.description },
      { property: "og:site_name", content: config.title },
      { property: "og:type", content: "website" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...(config.head?.meta ?? []),
    ],
    links: [
      { rel: "icon", href: favicon, type: faviconType(favicon) },
      { rel: "shortcut icon", href: favicon, type: faviconType(favicon) },
      ...props.stylesheets.map(href => ({ rel: "stylesheet", href })),
      ...feedLinks,
      ...(config.head?.links ?? []),
    ],
    scripts: [{ children: buildThemeScript() }, ...(config.head?.scripts ?? [])],
  }
}

/** A page's own `<head>` tags: canonical and `og:url`, plus title, description and
 *  image when given. With `language` set (a multi-language site) it adds `og:locale` and
 *  an `hreflang` link per entry in `alternates`. `canonicalPath` names another page as
 *  the original of this one. */
export function buildPageHead(props: {
  config: WebsiteConfig
  path: string
  canonicalPath?: string
  language?: SiteLanguage
  alternates?: { language: SiteLanguage; path: string }[]
  title?: string
  description?: string
  image?: string
  isArticle?: boolean
}) {
  const site = props.config.site?.replace(/\/+$/, "")
  const description = props.description
  const canonical = props.canonicalPath ?? props.path
  const url = site ? buildAbsoluteUrl(site, props.config.base, canonical) : undefined
  const image =
    site && props.image
      ? buildAbsoluteUrl(site, props.config.base, props.image)
      : undefined
  return {
    meta: [
      ...(props.title
        ? [{ title: props.title }, { property: "og:title", content: props.title }]
        : []),
      ...(description
        ? [
            { name: "description", content: description },
            { property: "og:description", content: description },
          ]
        : []),
      ...(props.language
        ? [{ property: "og:locale", content: props.language.locale.replace("-", "_") }]
        : []),
      ...(props.isArticle ? [{ property: "og:type", content: "article" }] : []),
      ...(url ? [{ property: "og:url", content: url }] : []),
      ...(image ? [{ property: "og:image", content: image }] : []),
    ],
    links: [
      ...(url ? [{ rel: "canonical", href: url }] : []),
      ...(site ? buildAlternateLinks(site, props.config.base, props.alternates) : []),
      ...(props.isArticle
        ? [
            {
              rel: "alternate",
              type: "text/markdown",
              href: prefixUrl(`${canonical}index.md`, props.config.base),
            },
          ]
        : []),
    ],
  }
}

function buildAlternateLinks(
  site: string,
  base: string | undefined,
  alternates: { language: SiteLanguage; path: string }[] | undefined,
) {
  if (!alternates || alternates.length < 2) return []
  const links = alternates.map(alternate => ({
    rel: "alternate",
    hrefLang: alternate.language.locale,
    href: buildAbsoluteUrl(site, base, alternate.path),
  }))
  const fallback = alternates.find(alternate => alternate.language.default)
  if (!fallback) return links
  return [
    ...links,
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: buildAbsoluteUrl(site, base, fallback.path),
    },
  ]
}

function buildAbsoluteUrl(site: string, base: string | undefined, url: string) {
  const prefixed = prefixUrl(url, base)
  if (!prefixed.startsWith("/") || prefixed.startsWith("//")) return prefixed
  return `${site}${prefixed}`
}
