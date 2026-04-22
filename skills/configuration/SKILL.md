---
name: livemark-configuration
description: Use when editing livemark.config.ts — site metadata, include/exclude globs, syntax themes, sections (article/blog/changelog), navigation links, and patches.
---

# Livemark Configuration

Guidance for editing `livemark.config.ts` at the project root.

## When to use this skill

Invoke when the user asks to:

- Set the site title, description, canonical URL, logo, favicon.
- Change which files are included or excluded.
- Switch code-block syntax highlighting themes.
- Add, reorder, or retype a section (docs/blog/changelog).
- Add or remove header/sidebar links.
- Patch a specific file's frontmatter without editing its source.

## The config shape

```ts
// livemark.config.ts
import { defineConfig } from "livemark"

export default defineConfig({
  // Required
  include: "docs/**/*.md", // string | string[] of glob patterns

  // Optional: site metadata
  site: "https://example.com", // canonical origin — enables sitemap
  title: "My Docs", // <title>, og:title, header
  description: "Short blurb.", // <meta description>, og:description
  logo: "/logo.svg", // header mark; also default favicon
  favicon: "/favicon.ico", // browser tab icon

  // Optional: content selection
  exclude: "docs/drafts/**", // string | string[]

  // Optional: syntax themes (Shiki)
  codeThemeLight: "catppuccin-latte", // default
  codeThemeDark: "catppuccin-mocha", // default

  // Optional: navigation
  links: [{ url: "https://github.com/x/y", title: "GitHub", icon: "github" }],

  // Optional: sections
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

  // Optional: per-file frontmatter overrides
  patches: [
    { file: "README.md", article: { title: "Overview", icon: "sparkles" } },
  ],
})
```

## Sections: the three types

`sections` is optional. Omitting it gives a single default docs section.

- **Article** (default when `type` is omitted): flat docs with a tree sidebar.
- **Blog** (`type: "blog"`): auto-generated index at `prefix`, sorts by `date`, exposes `/prefix/tags/<tag>/` pages.
- **Changelog** (`type: "changelog"`): reads `source` file; with `version: true`, splits on semver headings into per-version articles.

Shared fields on every section: `title`, `prefix` (keep trailing-slashed), `type`, `icon` (lucide), `position` (`"header"` default, `"sidebar"` also available).

Article-to-section matching is longest-prefix-wins on the article's URL `path`.

## Links

```ts
{
  url: "https://example.com",
  title: "Example",
  icon: "github",                          // lucide name, kebab-case
  position: "header",                      // or "sidebar"
  prefix: "/blog/",                        // optional: only show in this section
}
```

Default `position` is `"header"`. Use `prefix` to scope a sidebar link to a single section.

## Syntax themes

Any [Shiki theme](https://shiki.style/themes) name works. Defaults keep the catppuccin pairing. If you swap the light theme, audit code-block token contrast against the theme's background (WCAG AA wants 4.5:1).

## Editing rules of thumb

1. **Don't invent fields.** Livemark's `UserConfig` is a strict zod schema. Unknown keys throw at config load.
2. **Strings are literals.** Section `prefix` values are compared exactly; keep them consistent (`/blog/`, not `/blog`).
3. **Array order matters** for `sections` and `links` — it drives tab / link display order.
4. **Patches are silent on miss.** If `file` doesn't match any included article, nothing happens (no warning). Spell the path carefully.

## Autoreload

The dev server watches `livemark.config.ts` and restarts on edit. No need to kill `pnpm docs:start` after tweaking the config.

## Verification

- `pnpm type` — catches schema mismatches.
- `pnpm docs:build` — prerenders with the new config; the output listing shows whether section routes resolved.

## References

- Config schema: `models/config.ts`.
- Section variants: `models/section.ts`.
- Link shape: `models/link.ts`.
- Patch shape: `models/patch.ts`.
- Narrative docs: `docs/customization/`.
