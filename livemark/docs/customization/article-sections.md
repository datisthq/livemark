---
description: Organize articles into Docs, Blog, and Changelog sections.
path: /customization/article-sections/
icon: layout-panel-left
order: 3
---

# Article Sections

A section is a group of articles that share a URL prefix, a sidebar, and a navigation tab. Livemark ships three section types, plus a custom one that is only a tab:

- **Article** — the default. A tree of articles with a collapsible sidebar.
- **Blog** — date-sorted posts with tags and an auto-generated index.
- **Changelog** — a single source file (or GitHub releases) split into per-version articles.
- **Custom** — a tab linking to any URL, internal or external, with no articles of its own.

## Basic usage

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
      version: true,
    },
  ],
})
```

When `sections` is omitted, all articles render into a single default section — useful for small sites.

## Common fields

Every section, regardless of type, accepts:

| Field             | Type                                             | Default     | Purpose                                                                                                                  |
| ----------------- | ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `title`           | `string`                                         | —           | Label for the section tab and sidebar header.                                                                            |
| `prefix`          | `string`                                         | —           | URL prefix (e.g. `/`, `/blog/`, `/changelog/`). Articles with matching `path`s are routed here. Every type but `custom`. |
| `type`            | `"article" \| "blog" \| "changelog" \| "custom"` | `"article"` | Section type.                                                                                                            |
| `icon`            | `string`                                         | —           | Lucide icon shown next to the title. Without one, the tab has no icon.                                                   |
| `position`        | `"header" \| "sidebar"`                          | `"header"`  | Where the section tab renders.                                                                                           |
| `siteTitle`       | `string`                                         | —           | Replaces the site `title` in the sidebar header and breadcrumbs while you are in the section, and titles its RSS feed.   |
| `siteDescription` | `string`                                         | —           | Replaces the site `description` in the sidebar header while you are in the section, and describes its RSS feed.          |
| `siteLink`        | `string`                                         | home page   | Where the site title links while you are in the section — an internal path or an absolute URL.                           |

When header sections and links outgrow the header, the search field shrinks to an icon, then the ones that still don't fit fold into a **More** menu.

On mobile, every section collapses into the sidebar. Inside a section they become a picker that opens a bottom sheet: choosing one shows that section's articles, posts or releases in the sidebar without leaving the current page.

## Article sections

Plain docs. Sidebar shows the article tree. This is the default — you can omit `type` entirely:

```typescript
{ title: "Docs", prefix: "/" }
```

## Blog sections

Blog sections sort articles by `date` (newest first), render an auto-generated index at the section prefix, and expose per-tag pages.

```typescript
{
  title: "Blog",
  prefix: "/blog/",
  type: "blog",
}
```

Then in each post:

```yaml
---
title: Announcing v0.3
date: 2026-04-15
tags: [announcement, release]
---
```

Livemark auto-generates:

- `/blog/` — index listing all posts, newest first.
- `/blog/tags/<tag>/` — one page per tag.

## Changelog sections

A changelog section reads from a `source` file and splits it into one article per `##` heading.

```typescript
{
  title: "Changelog",
  prefix: "/changelog/",
  type: "changelog",
  source: "CHANGELOG.md",
  version: true,
}
```

A heading like `## 0.3.0 — 2026-04-01` becomes an article at `/changelog/0-3-0/`, named after its first word. With `version: true`, the section's header tab also shows the latest version in parentheses.

A site can declare several changelog sections — for example one per package in a monorepo — as long as each has its own `prefix`. Each renders its own release pages under its prefix, its own releases list in the sidebar, and its own latest version, so two changelogs that both contain `0.2.0` produce `/changelog/0-2-0/` and `/python/changelog/0-2-0/` side by side.

```typescript
sections: [
  {
    title: "Changelog",
    prefix: "/changelog/",
    type: "changelog",
    source: "CHANGELOG.md",
  },
  {
    title: "Python Changelog",
    prefix: "/python/changelog/",
    type: "changelog",
    source: "python/CHANGELOG.md",
  },
]
```

Changelog-specific fields:

| Field     | Type      | Default | Purpose                                                           |
| --------- | --------- | ------- | ----------------------------------------------------------------- |
| `source`  | `string`  | —       | Path to the changelog source file, relative to your project root. |
| `version` | `boolean` | `false` | If true, show the latest version next to the header tab's title.  |

## Custom sections

A custom section takes a `url` instead of a `prefix` and renders only as a tab. An internal URL such as `/about/` — for example a [custom route](/customization/custom-routes/) — highlights the tab while you are on it; an absolute URL opens another site.

```typescript
{ title: "About", type: "custom", url: "/about/" }
```

## Ordering and matching

Article paths are matched to sections by longest-prefix wins. Given `/blog/2024/launch/` and sections with prefixes `/` and `/blog/`, the article is placed in `/blog/`.

Keep prefixes trailing-slashed (`/blog/`, not `/blog`) for predictable matching.

## See also

- [External Links](/customization/external-links/) — add external links next to your section tabs.
- [Frontmatter](/authoring/frontmatter/) — the `path`, `order`, `date`, `tags` fields that drive section content.
