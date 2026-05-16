---
title: Starlight vs Livemark
label: Starlight
description: React + TanStack Start vs Astro Islands for docs.
path: /comparison/starlight/
icon: star
order: 4
---

# Starlight vs Livemark

[Starlight](https://starlight.astro.build) is the official Astro docs theme, maintained by the Astro team. It uses Astro's islands architecture (zero JavaScript by default, opt-in interactive components) and supports MDX content.

## At a glance

| Axis               | Livemark                         | Starlight                                                              |
| ------------------ | -------------------------------- | ---------------------------------------------------------------------- |
| Language / runtime | TypeScript / Node 24+            | TypeScript / Node 18+                                                  |
| UI framework       | React 19                         | Astro components (HTML-first), optional React/Vue/Svelte/Solid islands |
| Build tool         | Vite + TanStack Start            | Astro (Vite under the hood)                                            |
| Content format     | Markdown + MDX                   | Markdown + MDX + MDoc                                                  |
| License            | MIT, self-hosted                 | MIT, self-hosted                                                       |
| Output model       | Prerendered static (SSR-capable) | Prerendered static (SSR-capable via adapters)                          |

## Architecture

Livemark renders React at build time (prerender) and at runtime (client hydration). Every page ships React; interactivity is universal.

Starlight uses Astro's islands model: pages are rendered to HTML at build time with zero JavaScript by default. Interactive components are explicit "islands" that hydrate on demand. The default Starlight theme is mostly Astro components (no client JS); reaching for React/Vue/Svelte is opt-in.

Both build through Vite. Astro's component model is Astro's own `.astro` syntax (HTML + JS frontmatter, statically analyzed). Livemark's component model is React.

Content layout is unconstrained on the Livemark side: it scans by glob (`include`/`exclude` in `livemark.config.ts`), and each article's URL is set by a `path:` frontmatter field rather than its file location. There's no required `docs/` folder — a project can pull articles from `README.md`, `docs/`, `blog/`, package READMEs, or anywhere else. Starlight requires content in `src/content/docs/` (Astro's content-collections directory), with routes derived from file paths under that root.

## Content surface

Both tools accept Markdown + MDX with frontmatter.

Starlight additionally supports MDoc (Markdoc) for structured, validated content with custom tags. Components in `.mdx` files are Astro components by default; framework components (React, etc.) need explicit `client:*` directives to hydrate.

Livemark's components in `.mdx` files are React; hydration happens uniformly.

Frontmatter shape differs: Starlight uses `title`, `description`, `sidebar`, `tableOfContents`, `editUrl`, `lastUpdated`. Livemark uses `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Feature matrix

| Capability                  | Livemark                              | Starlight                               |
| --------------------------- | ------------------------------------- | --------------------------------------- |
| Versioning                  | No                                    | No (community plugins)                  |
| Internationalization (i18n) | No                                    | Yes (built-in)                          |
| Search                      | Yes (Orama, client-side)              | Yes (Pagefind, built-in)                |
| Zero-JS by default          | No (React hydrates)                   | Yes (islands architecture)              |
| Blog                        | Yes (built-in section type)           | No (use Astro's content collections)    |
| Changelog                   | Yes (section type)                    | No                                      |
| Sitemap                     | Yes                                   | Yes                                     |
| RSS                         | Yes (per blog section)                | Via `@astrojs/rss` integration          |
| Themes                      | Component overrides via `.livemark/`  | Component overrides via Starlight slots |
| Plugins                     | Vite plugins + remark/rehype          | Astro integrations + Starlight plugins  |
| Custom routes               | `.livemark/routes/` (TanStack Router) | Astro pages alongside Starlight content |

## Output & deployment

Both produce a directory of static HTML + assets. Starlight emits to `dist/` by default; Livemark emits to `.livemark/build/client/`. The hosting story is the same — see Livemark's [Deployment](/deployment/) for host guides.

Starlight inherits Astro's adapter system, which supports SSR on Cloudflare, Netlify, Vercel, Node, and Deno. Livemark relies on TanStack Start's Nitro presets for the same dynamic deployments.

## See also

- [Authoring](/authoring/) — Livemark's Markdown surface.
- [Customization](/customization/) — Livemark's config knobs and component overrides.
- [Comparison](/comparison/) — back to the index.
