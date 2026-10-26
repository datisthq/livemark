---
name: livemark-configuration
description: Use when editing livemark.config.ts — site metadata, include/exclude globs, syntax themes, sections (article/blog/changelog), navigation links, patches, and translations (languages).
---

# Livemark Configuration

Guidance for editing `livemark.config.ts` at the project root.

## When to use this skill

Invoke when the user asks to:

- Set the site title, description, canonical URL, logo, favicon, announcement banner.
- Change which files are included or excluded.
- Switch code-block syntax highlighting themes.
- Add, reorder, or retype a section (docs/blog/changelog).
- Add or remove header/sidebar links.
- Publish the site in several languages.
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
  banner: "v2 is out · [Notes](/blog/v2/)", // inline Markdown strip above the header; raw HTML dropped
  head: {
    // extra <head> tags after the defaults; a meta sharing name/property replaces one
    meta: [{ name: "twitter:site", content: "@me" }],
    links: [{ rel: "me", href: "https://mastodon.social/@me" }],
    scripts: [{ src: "https://example.com/analytics.js", defer: "" }],
  },

  // Optional: AI agents (llms.txt and Markdown twins are always emitted)
  contentSignals: { search: true, aiInput: true, aiTrain: true }, // robots.txt Content-Signal; all default true
  skills: "skills/*/SKILL.md", // publish skills at /.well-known/agent-skills/

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
  patches: [{ file: "README.md", article: { title: "Overview", icon: "sparkles" } }],
})
```

## Sections: the three types

`sections` is optional. Omitting it gives a single default docs section.

- **Article** (default when `type` is omitted): flat docs with a tree sidebar.
- **Blog** (`type: "blog"`): auto-generated index at `prefix`, sorts by `date`, exposes `/prefix/tags/<tag>/` pages.
- **Changelog** (`type: "changelog"`): reads `source` file; with `version: true`, splits on semver headings into per-version articles. Several changelog sections may coexist as long as their prefixes differ — each is cached in its own `.livemark/.cache/changelog/<slug-of-prefix>-<hash-of-prefix>/` directory (the hash keeps prefixes that slugify alike, like `/python/changelog/` and `/python-changelog/`, apart), so a version shared by two changelogs never collides. The `(version)` suffix only renders for `position: "header"` sections.

Shared fields on every section: `title`, `prefix` (keep trailing-slashed), `type`, `icon` (lucide), `position` (`"header"` default, `"sidebar"` also available). Header sections and links never overflow: past the bar's width Search turns icon-only, then the rest fold into a "More" menu.

Article-to-section matching is longest-prefix-wins on the article's URL `path`.

Versioned docs have no dedicated option. For a few versions on one branch, give each older version an article section (`{ title: "v1", prefix: "/v1/", siteTitle: "Acme v1" }`) and its articles `path`s under that prefix — search stays site-wide, so results mix versions. For majors on their own branches, deploy each branch as its own site (`base`, `banner` pointing to latest) and link them with a `custom` section.

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

## Languages

```ts
{
  title: { en: "Acme Docs", es: "Documentación" }, // any text field: string or per-code map
  languages: [
    { code: "en", label: "English" },              // first = default, served at /
    { code: "es", label: "Español",                 // served at /es/…
      messages: { "toc.title": "En esta página" } }, // optional UI-string overrides
  ],
}
```

- Localizable: `title`, `description`, `banner`, section `title` / `siteTitle` / `siteDescription`, link `title`. A missing code falls back to the default language's value.
- Every routed section is mirrored per language (`/blog/` → `/es/blog/`). A changelog mirror (`/es/changelog/<v>/`) shows the default-language notes in the translated page, with its canonical pointing at the original. A section `prefix` starting with a non-default code (`/es/…`) is rejected.
- `messages` keys are checked against `models/message.ts`; a typo fails the config load. de, es, fr, ja, ru and zh ship bundled and apply by `locale` (defaults to `code`).
- The header picker shows a flag per language: `flag` (two-letter country code) overrides the default taken from the locale's region, else the language (`en` → `gb`).
- Without `languages` the site is one implicit English language — output is unchanged.

## Syntax themes

Any [Shiki theme](https://shiki.style/themes) name works. Defaults keep the catppuccin pairing. If you swap the light theme, audit code-block token contrast against the theme's background (WCAG AA wants 4.5:1).

## Editing rules of thumb

1. **Don't invent fields.** Livemark's `UserConfig` is a strict zod schema. Unknown keys throw at config load.
2. **Strings are literals.** Section `prefix` values are compared exactly; keep them consistent (`/blog/`, not `/blog`).
3. **Array order matters** for `sections` and `links` — it drives tab / link display order.
4. **Patches are silent on miss.** If `file` doesn't match any included article, nothing happens (no warning). Spell the path carefully.

## Autoreload

The dev server watches `livemark.config.ts` and every local file it imports, and restarts on edit. No need to kill `npx livemark start` after tweaking the config. A broken config only pauses it: the error prints, and the next save retries. Upgrading `livemark` itself is the one change that needs a manual restart; the server prints a notice when it sees one.

## Verification

- The project's type check (e.g. `npx tsc --noEmit`) — catches schema mismatches.
- `npx livemark build` — prerenders with the new config; the output listing shows whether section routes resolved.

## References

- Config schema: `models/config.ts`.
- Section variants: `models/section.ts`.
- Link shape: `models/link.ts`.
- Languages and UI strings: `models/language.ts`, `models/message.ts`.
- Patch shape: `models/patch.ts`.
- Narrative docs: `docs/customization/`.
