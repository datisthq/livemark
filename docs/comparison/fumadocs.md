---
title: Fumadocs vs Livemark
label: Fumadocs
description: Vite + TanStack Start vs Next.js App Router for docs.
path: /comparison/fumadocs/
icon: square-dashed
order: 5
---

# Fumadocs vs Livemark

[Fumadocs](https://fumadocs.dev) is a Next.js-based docs framework built around the App Router. It splits responsibilities across separate packages: `fumadocs-core` (headless logic), `fumadocs-ui` (default UI components), and `fumadocs-mdx` (content source loader).

## At a glance

| Axis               | Livemark                         | Fumadocs                         |
| ------------------ | -------------------------------- | -------------------------------- |
| Language / runtime | TypeScript / Node 24+            | TypeScript / Node 18+            |
| UI framework       | React 19                         | React 18/19 (Next.js App Router) |
| Build tool         | Vite + TanStack Start            | Next.js (Turbopack/Webpack)      |
| Content format     | Markdown + MDX                   | Markdown + MDX                   |
| License            | MIT, self-hosted                 | MIT, self-hosted                 |
| Output model       | Prerendered static (SSR-capable) | Static or SSR (Next.js modes)    |

## Architecture

Livemark wraps Vite + TanStack Start. Routes, prerender, and component overrides are all from TanStack Start; Livemark adds content-collections for content loading and a default sidebar/layout/component layer on top.

Fumadocs assumes you already have (or want) a Next.js application. It's not a self-contained CLI — you scaffold a Next project, install Fumadocs packages, and wire `fumadocs-core` and `fumadocs-ui` into your App Router. Content is read by `fumadocs-mdx` from `.md`/`.mdx` files and surfaced as typed objects.

The package split is intentional: `fumadocs-core` exposes hooks and primitives without UI, so projects can swap `fumadocs-ui` for a custom UI without forking.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Fumadocs reads from a single configured content directory (defined in `fumadocs-mdx`'s source plugin); routes are derived from file paths under that root.

## Content surface

Both tools accept Markdown + MDX with frontmatter and embedded React components.

Fumadocs uses `fumadocs-mdx` (a custom MDX loader) which produces TypeScript-typed content objects with full IntelliSense for frontmatter. Custom components live alongside your Next app code.

Livemark uses content-collections under the hood for the same purpose: validated frontmatter (via Zod schemas) and typed article exports.

Frontmatter shape differs: Fumadocs uses `title`, `description`, `icon`, `full`. Livemark uses `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Feature matrix

| Capability                  | Livemark                              | Fumadocs                                     |
| --------------------------- | ------------------------------------- | -------------------------------------------- |
| Versioning                  | No                                    | Partial (via separate content sources)       |
| Internationalization (i18n) | No                                    | Yes (built-in)                               |
| Search                      | Yes (Orama, client-side)              | Yes (Orama-based, optional Algolia)          |
| OpenAPI rendering           | No                                    | Yes (`fumadocs-openapi`)                     |
| Blog                        | Yes (built-in section type)           | No (use Next routes)                         |
| Changelog                   | Yes (section type)                    | No                                           |
| Sitemap                     | Yes                                   | Via Next.js `sitemap.ts`                     |
| RSS                         | Yes (per blog section)                | Via Next.js routes                           |
| Themes                      | Component overrides via `.livemark/`  | Swap `fumadocs-ui` or override per-component |
| Custom routes               | `.livemark/routes/` (TanStack Router) | Any Next App Router page                     |
| Standalone CLI              | Yes (`livemark build`)                | No (Next.js commands)                        |

## Output & deployment

Livemark prerenders every route at build time. The output is a static directory you deploy anywhere — see [Deployment](/deployment/).

Fumadocs inherits Next.js's output modes: full static export (`output: 'export'`), hybrid SSG/SSR, or fully dynamic. Deployment matches whatever Next.js supports — Vercel is the default target, but any Node host or Cloudflare Workers (via OpenNext) works.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
