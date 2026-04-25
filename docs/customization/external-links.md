---
description: Add external URLs to the header or the sidebar.
path: /customization/external-links/
icon: external-link
order: 6
---

# External Links

The `links` array attaches external URLs to the header or the sidebar. Each entry renders as a link with an optional icon.

## Basic usage

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  links: [
    {
      url: "https://github.com/acme/docs",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## Fields

| Field      | Type                    | Default    | Purpose                                                           |
| ---------- | ----------------------- | ---------- | ----------------------------------------------------------------- |
| `url`      | `string`                | —          | External URL.                                                     |
| `title`    | `string`                | —          | Visible label.                                                    |
| `icon`     | `string`                | —          | Lucide icon name (e.g. `github`, `twitter`, `mail`).              |
| `prefix`   | `string`                | —          | Section path prefix; if set, the link only shows in that section. |
| `position` | `"header" \| "sidebar"` | `"header"` | Where the link renders.                                           |

Icons come from [lucide-react](https://lucide.dev/icons). Use the kebab-case name.

## Header links

By default, links render to the right of the section tabs in the header. An external icon is appended automatically.

```typescript
links: [
  { url: "https://github.com/acme/docs", title: "GitHub", icon: "github" },
  { url: "https://twitter.com/acme", title: "Twitter", icon: "twitter" },
]
```

## Sidebar links

Set `position: "sidebar"` to render inside the left sidebar, below the sections tree.

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main",
    title: "Edit on GitHub",
    icon: "pencil",
    position: "sidebar",
  },
]
```

## Scoping a link to a section

Use `prefix` to show a link only when a specific section is active. This is useful for per-section "Edit on GitHub" or "Report issue" shortcuts.

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main/blog",
    title: "Edit on GitHub",
    icon: "pencil",
    prefix: "/blog/",
    position: "sidebar",
  },
]
```

## See also

- [Article Sections](/customization/article-sections/) — the `prefix` values that `prefix` on a link targets.
- [Site Metadata](/customization/site-metadata/) — the brand title and logo that sit next to header links.
