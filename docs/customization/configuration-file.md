---
description: Where the Livemark config lives, what it controls, and a tour of the top-level options.
path: /customization/config-file/
icon: layers
order: 1
---

# Config File

:::tip
The config file is optional. By default Livemark picks up every `.md` file in the folder where you run it.
:::

Livemark is configured by a single file at the root of your project: **`livemark.config.ts`**. Drop it next to your `package.json`, export a `defineConfig({...})` call, and Livemark picks it up automatically — no flag, no env var.

## Minimal config

Every field is optional. The smallest valid config is just an empty call:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({})
```

That picks up every `.md` file under your project (default `include: "**/*.md"`) and renders it with the standard Livemark theme — sidebar, search, syntax highlighting, dark mode, all defaults.

## What you can configure

Every field falls back to a sensible default. The full set:

| Option           | Type                                            | Purpose                                                                      |
| ---------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `include`        | `string \| string[]`                            | Glob(s) for content files. Default: `"**/*.md"`.                             |
| `exclude`        | `string \| string[]`                            | Glob(s) to skip (drafts, partials, etc.).                                    |
| `title`          | `string`                                        | Site title shown in the header and `<title>`. Default: `"Livemark"`.         |
| `description`    | `string`                                        | Meta description for SEO/Open Graph. Default: `"Markdown site generator"`.   |
| `site`           | `string`                                        | Canonical site URL — required for sitemap generation.                        |
| `favicon`        | `string`                                        | Path to a favicon image, relative to project root.                           |
| `logo`           | `string`                                        | Path to a logo image used in the header (falls back to favicon).             |
| `codeThemeLight` | Shiki theme name                                | Light-mode syntax theme. Default: `"catppuccin-latte"`.                      |
| `codeThemeDark`  | Shiki theme name                                | Dark-mode syntax theme. Default: `"catppuccin-mocha"`.                       |
| `sections`       | [`Section[]`](/customization/article-sections/) | Split content into Docs / Blog / Changelog with their own URL prefixes.      |
| `links`          | [`Link[]`](/customization/external-links/)      | Custom links shown in the header or sidebar.                                 |
| `patches`        | [`Patch[]`](/customization/article-patches/)    | Override a markdown file's frontmatter from config without editing the file. |

The full schema lives in [`source/models/config.ts`](https://github.com/datisthq/livemark/blob/main/source/models/config.ts) — `defineConfig` validates against it with Zod, so typos get a clear error at start-up.

## Worked example

Most real sites end up looking something like this:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  site: "https://docs.example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  exclude: "docs/**/_*",
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
  ],
  links: [
    {
      url: "https://github.com/example/project",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## Where to go next

- [Site Metadata](/customization/site-metadata/) — title, description, favicon, logo.
- [Article Sections](/customization/article-sections/) — split content into multiple URL prefixes (docs / blog / changelog).
- [External Links](/customization/external-links/) — header and sidebar links.
- [Syntax Themes](/customization/syntax-themes/) — pick or extend Shiki themes.
- [Article Patches](/customization/article-patches/) — override frontmatter from config.
- [Overriding/Escaping](/customization/overriding-escaping/) — replace any built-in component or stylesheet.
- [Custom Routes](/customization/custom-routes/) — add fully custom pages.
