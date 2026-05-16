---
title: Hugo vs Livemark
label: Hugo
description: Docs-first Node tool vs general-purpose Go static site generator.
path: /comparison/hugo/
icon: feather
order: 8
---

# Hugo vs Livemark

[Hugo](https://gohugo.io) is a general-purpose static site generator written in Go. It ships as a single binary, builds extremely quickly, and powers everything from blogs and portfolios to documentation sites via community themes like [Docsy](https://www.docsy.dev) and [Hugo Book](https://github.com/alex-shpak/hugo-book).

## At a glance

| Axis               | Livemark                         | Hugo                           |
| ------------------ | -------------------------------- | ------------------------------ |
| Language / runtime | TypeScript / Node 24+            | Go (single binary, no runtime) |
| UI framework       | React 19                         | Go templates (HTML + CSS)      |
| Build tool         | Vite + TanStack Start            | Hugo binary                    |
| Content format     | Markdown + MDX                   | Markdown with Hugo shortcodes  |
| License            | MIT, self-hosted                 | Apache-2.0, self-hosted        |
| Output model       | Prerendered static (SSR-capable) | Prerendered static             |

## Architecture

Livemark is a Node CLI built on Vite + TanStack Start + React. Authoring follows JS/TS conventions.

Hugo is a single Go binary — no runtime dependencies, no package install step. The site structure is convention-based: `content/`, `layouts/`, `static/`, `themes/`, `config.toml` (or `.yaml`/`.json`). Layouts use Go's `html/template` syntax. Themes are git-submoduled or copied into `themes/<name>/`.

Hugo is not docs-specific. The same binary powers blogs, marketing sites, portfolios, and docs — the docs use case is supported through themes rather than first-class section types.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Hugo reads from `content/` with URL structure mirroring the directory tree (and per-section frontmatter overrides).

## Content surface

Both tools accept Markdown with frontmatter.

The major asymmetry is component embedding: Livemark uses MDX (React components in `.md`/`.mdx`). Hugo uses **shortcodes** — Go-templated functions invoked from Markdown with `{{< shortcode-name arg="value" >}}`. Shortcodes are defined in `layouts/shortcodes/*.html` as Go template snippets and emit HTML directly.

Hugo supports Goldmark-based Markdown extensions (footnotes, tables, definition lists, math via plugins). For richer interactivity, the typical pattern is to embed a `<script>` or use a JS framework as an island inside a shortcode.

Frontmatter shape differs: Hugo accepts TOML, YAML, or JSON frontmatter with fields like `title`, `date`, `draft`, `weight`, `taxonomies`, plus user-defined fields. Livemark uses inline YAML with `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Feature matrix

| Capability                  | Livemark                              | Hugo                                      |
| --------------------------- | ------------------------------------- | ----------------------------------------- |
| Versioning                  | No                                    | No (manual via branches/sites)            |
| Internationalization (i18n) | No                                    | Yes (built-in, multilingual mode)         |
| Search                      | Yes (Orama, client-side)              | No (theme-provided or external)           |
| Blog                        | Yes (built-in section type)           | Yes (any section can be date-sorted)      |
| Changelog                   | Yes (section type)                    | No (manual)                               |
| Sitemap                     | Yes                                   | Yes (built-in)                            |
| RSS                         | Yes (per blog section)                | Yes (built-in, per section)               |
| Themes                      | Component overrides via `.livemark/`  | Theme directories with template overrides |
| Plugins                     | Vite plugins + remark/rehype          | Hugo Modules (Go), shortcodes, hooks      |
| Custom routes               | `.livemark/routes/` (TanStack Router) | Layouts + content sections                |
| Standalone toolchain        | Node + npm                            | Single Go binary                          |
| Build speed                 | Vite-fast                             | Among the fastest SSGs                    |

## Output & deployment

Both tools produce static HTML + assets ready for any static host. Hugo emits to `public/` by default; Livemark emits to `.livemark/build/client/`. The hosting story is the same — see Livemark's [Deployment](/deployment/) for host guides.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
