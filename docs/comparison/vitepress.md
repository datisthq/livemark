---
title: VitePress vs Livemark
label: VitePress
description: Two Vite-native, Markdown-first docs frameworks on different UI stacks.
path: /comparison/vitepress/
icon: zap
order: 2
---

# VitePress vs Livemark

[VitePress](https://vitepress.dev) is the official Vue docs framework, built on Vite. It's Markdown-first, ships a minimal default theme, and is what powers most Vue ecosystem documentation (Vue itself, Vite, Pinia, …).

## At a glance

| Axis               | Livemark                         | VitePress                    |
| ------------------ | -------------------------------- | ---------------------------- |
| Language / runtime | TypeScript / Node 24+            | TypeScript / Node 18+        |
| UI framework       | React 19                         | Vue 3                        |
| Build tool         | Vite + TanStack Start            | Vite (custom build pipeline) |
| Content format     | Markdown + MDX                   | Markdown with Vue templating |
| License            | MIT, self-hosted                 | MIT, self-hosted             |
| Output model       | Prerendered static (SSR-capable) | Prerendered static (SSG)     |

## Architecture

Both tools are Vite-native. The split is in everything above Vite: Livemark layers TanStack Start (router + server functions + prerender pipeline) and renders React; VitePress wraps Vite with its own SSG pipeline and renders Vue.

VitePress runtime is `vue-router` plus a built-in default theme. Livemark uses TanStack Router and ships its own component layer (sidebar, layout, search) that consumers can override file-by-file via `.livemark/`.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. VitePress expects all content under a single source root (`docs/` by default, configurable via `srcDir`), with routes derived from file paths.

## Content surface

VitePress accepts Markdown with built-in Vue templating — you can use Vue components and `<script setup>` blocks inside `.md` files. It does **not** support MDX in the React sense.

Livemark accepts Markdown + MDX. Embedded components are React.

Both support frontmatter for per-page metadata. VitePress uses `title`, `layout`, `sidebar`, `outline`, `prev`/`next`. Livemark uses `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

Callouts/admonitions: VitePress uses `::: tip` / `::: warning` containers (same syntax as Livemark's `:::tip` directives, evaluated by different parsers).

## Feature matrix

| Capability                  | Livemark                              | VitePress                             |
| --------------------------- | ------------------------------------- | ------------------------------------- |
| Versioning                  | No                                    | No (community workarounds)            |
| Internationalization (i18n) | No                                    | Yes (built-in)                        |
| Search                      | Yes (Orama, client-side)              | Yes (local + Algolia)                 |
| Blog                        | Yes (built-in section type)           | No (community plugins)                |
| Changelog                   | Yes (section type)                    | No                                    |
| Sitemap                     | Yes                                   | Yes                                   |
| RSS                         | Yes (per blog section)                | No                                    |
| Themes                      | Component overrides via `.livemark/`  | Custom themes via `.vitepress/theme/` |
| Plugins                     | Vite plugins + remark/rehype          | Vite plugins + markdown-it plugins    |
| Custom routes               | `.livemark/routes/` (TanStack Router) | Dynamic routes via `paths()`          |

## Output & deployment

Both produce a directory of static HTML + assets ready for any static host. VitePress emits to `.vitepress/dist/` by default; Livemark emits to `.livemark/build/client/`. The hosting story is identical — see Livemark's [Deployment](/deployment/) for host guides.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
