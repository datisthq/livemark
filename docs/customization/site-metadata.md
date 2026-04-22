---
title: Site Metadata
description: Set site title, description, URL, logo, and favicon.
icon: globe
order: 2
path: /customization/site-metadata/
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
})
```

| Field         | Type     | Default                     | Where it surfaces                                                         |
| ------------- | -------- | --------------------------- | ------------------------------------------------------------------------- |
| `site`        | `string` | —                           | Canonical origin used by the sitemap and absolute URLs                    |
| `title`       | `string` | `"Livemark"`                | `<title>`, Open Graph `og:title`, header site title                       |
| `description` | `string` | `"Markdown site generator"` | `<meta name="description">`, `og:description`                             |
| `logo`        | `string` | —                           | Image shown next to the site title in the header (and as favicon default) |
| `favicon`     | `string` | `logo ?? bundled default`   | Browser tab icon                                                          |

## Sitemap and `site`

If `site` is set, Livemark builds a `sitemap.xml` at the root of your output during `docs:build`, using `site` as the absolute origin for every URL. Without `site`, sitemap generation is skipped.

## Logo and favicon

- `logo` and `favicon` accept any URL or root-relative path (`/logo.svg`). Assets placed in `.livemark/public/` are served at `/…` and work well here.
- If `favicon` is omitted, Livemark falls back to `logo`, and finally to its bundled mark.
- The MIME type is inferred from the extension (`.svg`, `.png`, `.ico`).

:::tip
Keep the `logo` file small (an SVG is ideal). It inlines into the header on every page.
:::

## See also

- [Navigation Links](/customization/navigation-links/) — header/sidebar links that live next to the title.
- [Sections](/customization/sections/) — structuring the content of the site itself.
