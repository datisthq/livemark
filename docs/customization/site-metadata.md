---
title: Site Metadata
description: Set site title, description, URL, logo, favicon, and banner.
path: /customization/site-metadata/
icon: globe
order: 2
---

# Site Metadata

A few top-level fields on `livemark.config.ts` describe your site to browsers, search engines, and social cards.

## Fields

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  site: "https://example.com",
  title: "My Docs",
  description: "Everything you need to build things.",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  banner: "v2 is out · [Read the release notes](/blog/v2/)",
  head: { meta: [{ name: "twitter:site", content: "@me" }] },
})
```

| Field         | Type     | Default                     | Where it surfaces                                                         |
| ------------- | -------- | --------------------------- | ------------------------------------------------------------------------- |
| `site`        | `string` | —                           | Canonical origin used by the sitemap and absolute URLs                    |
| `title`       | `string` | `"Livemark"`                | `<title>`, Open Graph `og:title`, header site title                       |
| `description` | `string` | `"Markdown site generator"` | `<meta name="description">`, `og:description`                             |
| `logo`        | `string` | —                           | Image shown next to the site title in the header (and as favicon default) |
| `favicon`     | `string` | `logo ?? bundled default`   | Browser tab icon                                                          |
| `banner`      | `string` | —                           | Announcement strip above the header on every page                         |
| `head`        | `object` | —                           | Extra `meta`, `links` and `scripts` in every page's `<head>`              |

## Sitemap and `site`

If `site` is set, Livemark builds a `sitemap.xml` at the root of your output during `docs:build`, using `site` as the absolute origin for every URL. Without `site`, sitemap generation is skipped.

## Logo and favicon

- `logo` and `favicon` accept any URL or root-relative path (`/logo.svg`). Assets placed in `.livemark/public/` are served at `/…` and work well here.
- If `favicon` is omitted, Livemark falls back to `logo`, and finally to its bundled mark.
- The MIME type is inferred from the extension (`.svg`, `.png`, `.ico`).

:::tip
Keep the `logo` file small (an SVG is ideal). It inlines into the header on every page.
:::

## Banner

`banner` shows a full-width strip above the header on every page; it scrolls away while the header stays pinned. The value is inline Markdown — links, `**bold**`, `_emphasis_` and `` `code` `` — so a one-line announcement needs no custom component:

```typescript title="livemark.config.ts"
banner: "Livemark is in technical preview · [Share feedback →](https://github.com/datisthq/livemark/discussions)",
```

- Absolute links open in a new tab; root-relative links get your `base` prefix.
- Raw HTML tags are dropped. For icons or custom markup, escape `components/Banner.tsx` instead ([Overriding/Escaping](/customization/overriding-escaping/)).
- The strip uses the `--banner` and `--banner-foreground` color tokens.

## Per-page tags

Every article page overrides the site defaults with its own `<title>`, `description`, `og:title`, `og:description` and `og:type` (`article`). With `site` set, it also gets `og:url`, a `<link rel="canonical">` and, from the frontmatter `image`, an absolute `og:image`.

## Extra head tags

`head` adds tags to every page, after the defaults. A `meta` entry with the same `name` or `property` as a default replaces it:

```typescript title="livemark.config.ts"
export default defineConfig({
  head: {
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "abc123" },
    ],
    links: [{ rel: "me", href: "https://mastodon.social/@me" }],
    scripts: [{ src: "https://example.com/analytics.js", defer: "" }],
  },
})
```

To drop or rewrite a default tag, escape `head.ts` and edit what `customizeHead` returns:

```typescript title=".livemark/head.ts"
import type { RootHead } from "livemark"

export function customizeHead(head: RootHead) {
  head.meta = head.meta.filter(m => m.property !== "og:site_name")
  return head
}
```

## See also

- [External Links](/customization/external-links/) — header/sidebar links that live next to the title.
- [Article Sections](/customization/article-sections/) — structuring the content of the site itself.
