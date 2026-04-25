# Livemark

Livemark turns plain Markdown into a fast, modern documentation site. Point it at a folder of `.md` files and it gives you a deployable React + Vite site with search, syntax highlighting, blog and changelog sections, dark mode, and a customizable component library — all built in.

## What you get

- **Just write Markdown.** GitHub-flavored Markdown works out of the box, with frontmatter, custom heading IDs, footnotes, definition lists, and gemoji.
- **Beautiful code blocks.** Syntax highlighting via [Shiki](https://shiki.style/) with 100+ languages, dual light/dark themes, line highlights, diffs, and TwoSlash type hints.
- **Diagrams and math.** [Mermaid](https://mermaid.js.org/) flowcharts and KaTeX equations, theme-aware, zero config.
- **Rich elements.** Callouts, tabs, file trees, cards, columns, badges, package tabs (npm/pnpm/yarn/bun), embeds (YouTube, SoundCloud), and more — all as Markdown directives or MDX components.
- **Sections.** First-class support for docs, blog (with tags + RSS), and changelog (local `CHANGELOG.md` or GitHub releases).
- **Search.** Full-text search powered by [Orama](https://oramasearch.com/), keyboard shortcuts, smart table-of-contents.
- **Themable.** Tailwind v4, shadcn-style primitives, dark mode, and per-file overrides via a `.livemark/` folder.
- **Built on TanStack Start.** SSR, prerendering, sitemap, and routing for free.

## Quick start

You need [Node.js](https://nodejs.org/) 24+ and a package manager (pnpm, npm, yarn, or bun).

### Install

```bash
npm install livemark
```

### Configure

Create `livemark.config.ts` at the root of your project:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  include: ["docs/**/*.md"],
})
```

### Add content

```text title="docs/"
docs/
├── getting-started.md
└── usage.md
```

Each `.md` file supports frontmatter:

```md title="docs/getting-started.md"
---
title: Getting Started
description: Set up the project in five minutes.
icon: rocket
order: 1
---

# Getting Started

Welcome!
```

### Run

```bash
npx livemark start    # dev server with HMR at http://localhost:8000
npx livemark build    # production build to .livemark/build/
npx livemark preview  # serve the production build locally
```

That's the whole loop.

## Project structure

A typical Livemark site:

```text title="my-project/"
my-project/
├── livemark.config.ts   # configuration
├── docs/                # markdown content
├── blog/                # blog posts (optional)
├── CHANGELOG.md         # changelog source (optional)
└── .livemark/           # overrides + build cache (generated)
```

Anything under `.livemark/components/`, `.livemark/elements/`, or `.livemark/styles/` shadows the Livemark default with the same path — so you can customize components, primitives, and base CSS without forking the package. Run `npx livemark escape <path>` to copy a default into `.livemark/` ready to edit.

## Customization

Livemark is meant to look great with zero configuration and stay out of your way when you need more. Common customizations:

- **Site metadata** — title, description, favicon, logo. See the [Site Metadata guide](https://livemark.dev/customization/site-metadata/).
- **Sections** — split content into Docs / Blog / Changelog with their own URL prefixes. See [Article Sections](https://livemark.dev/customization/article-sections/).
- **External links** — header and sidebar links to anywhere. See [External Links](https://livemark.dev/customization/external-links/).
- **Syntax themes** — Shiki theme per light/dark. See [Syntax Themes](https://livemark.dev/customization/syntax-themes/).
- **Article patches** — override a markdown file's frontmatter from `livemark.config.ts` without touching the file. See [Article Patches](https://livemark.dev/customization/article-patches/).
- **Module escaping** — replace any built-in component or stylesheet from your project. See [Module Escaping](https://livemark.dev/customization/module-escaping/).
- **Custom routes** — drop a `.tsx` file into `.livemark/routes/` to add a fully custom page. See [Custom Routes](https://livemark.dev/customization/custom-routes/).

## Documentation

Full documentation lives at **[livemark.dev](https://livemark.dev)**:

- [Markdown reference](https://livemark.dev/markdown/) — every Markdown / MDX feature with examples
- [Customization](https://livemark.dev/customization/) — every knob, with copy-pasteable snippets
- [Changelog](https://livemark.dev/changelog/) — release notes
- [Contributing](https://livemark.dev/contributing/) — local setup and PR flow

## Resources

- **npm**: [npmjs.com/package/livemark](https://www.npmjs.com/package/livemark)
- **GitHub**: [github.com/datisthq/livemark](https://github.com/datisthq/livemark)
- **Issues**: [github.com/datisthq/livemark/issues](https://github.com/datisthq/livemark/issues)
- **Discussions**: [github.com/datisthq/livemark/discussions](https://github.com/datisthq/livemark/discussions)

## License

MIT — see [LICENSE.md](LICENSE.md).
