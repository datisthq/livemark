---
name: livemark-customization
description: Use when overriding Livemark's built-in UI or adding custom routes — shadow defaults with same-named files under .livemark/{components,elements,styles}, add .livemark/routes/*.tsx pages, or copy defaults with `livemark escape`.
---

# Livemark Customization

Guidance for customizing the UI layer of a Livemark project beyond what `livemark.config.ts` exposes.

## When to use this skill

Invoke when the user asks to:

- Change a built-in component's layout or markup (Footer, Sidebar, Banner, …).
- Restyle a shared primitive (buttons, inputs, cards, sheet, …).
- Rebrand via CSS tokens (colors, radii, typography).
- Add a brand-new page that isn't a Markdown article (landing hero, pricing page, about page).
- Replace Livemark's default landing page with a custom React component.
- Serve a custom `favicon.svg`, `robots.txt`, `og-image.png`, or other static asset.

## Three overlapping mechanisms

| Goal                              | Mechanism                                             |
| --------------------------------- | ----------------------------------------------------- |
| Replace a default component/style | Drop a file at `.livemark/components/<Name>.tsx` etc. |
| Add a new page at an exact URL    | Create `.livemark/routes/<path>.tsx`                  |
| Serve a static asset at `/<path>` | Put the file in `.livemark/public/<path>`             |
| Extend the generated `_headers`   | `.livemark/public/_headers` — kept, `Link` appended   |
| Rewrite site-wide `<head>` tags   | `.livemark/head.ts` exporting `customizeHead(head)`   |

None require config changes. The Vite plugin (`source/plugins/vite-livemark.ts`) watches `.livemark/**` and hot-reloads.

## Discovering what's overridable

Run the `escape` command with `--list` to print every overridable file:

```bash
livemark escape --list
```

Output is a flat `<subdir>/<file>` list across `components/`, `elements/`, and `styles/`. Without arguments in a terminal the command opens an interactive picker instead — agents should pass `--list` or explicit paths. With paths, it copies each default into `.livemark/`:

```bash
livemark escape components/Footer.tsx   # → .livemark/components/Footer.tsx
livemark escape elements/button.tsx styles/general.css   # several at once
```

The command refuses to overwrite an existing override (and exits 1 after copying the rest). Delete the override first if you want a fresh start.

## Typical workflow: override a component

1. `livemark escape components/Footer.tsx` — copy the default.
2. Edit `.livemark/components/Footer.tsx`. All the site's Footer renders shift to the new file on save.
3. Inside the override, import other Livemark modules from the `livemark/<subdir>/*` subpath exports:
   ```tsx
   import { cn } from "cn"
   import { Button } from "livemark/elements/button"
   ```

## Typical workflow: announcement banner

Prefer the `banner` config option — an inline Markdown string, rendered to HTML at build time and exposed as `bannerHtml` from `livemark:virtual`. Escape `components/Banner.tsx` only for icons or custom markup. The strip spans the full page width above both the sidebar and the sticky header — it scrolls away while the sidebar and header pin to the top (the sidebar container is `sticky`, not `fixed`, for this). Let it wrap (`flex-wrap`, `text-balance`, `min-w-0`) rather than `truncate`, so phones neither clip it nor scroll sideways. An escaped strip may keep to one line instead, as livemark.dev's does: `truncate` the message (`min-w-0` lets a flex item shrink), keep the link `shrink-0`, and hide its label with `sr-only sm:not-sr-only` — `hidden` would leave the phone's arrow-only link without a name. Style the injected HTML from the wrapper (`[&_a]:underline`): Tailwind never sees classes inside a config string. Search and the theme toggle sit at the right of the header, not in the sidebar. The header's section strip is `components/HeaderNav.tsx`; it tells `Header` when to render `<Search compact />` and folds what still doesn't fit into a "More" menu. Below `lg`, `Search` opens `components/HeaderSearch.tsx` instead of the dialog: a field that covers the whole header bar, with results dropping full-width beneath it — positioned `absolute` against the sticky header, so an override must stay inside `<header>`.

## Sidebar escapes

`Sidebar` picks the body slot (`SidebarArticles`, `SidebarPosts`, `SidebarReleases`) and passes each, plus `SidebarLinks`, the section to show as an optional `section` prop. On mobile inside a section it swaps the Sections list for `SidebarSectionPicker`, which changes that prop without navigating — an escaped body slot must read `props.section` before falling back to the route's section, or the picker stops working.

## Typical workflow: rebrand

1. `livemark escape styles/general.css`.
2. Edit the `:root` and `.dark` blocks in `.livemark/styles/general.css`:
   - `--primary` — brand accent (Tailwind-flavoured oklch values work).
   - `--positive`, `--warning`, `--destructive` — status tones, each with a `-foreground` for text on the fill and a `-tint` / `-tint-foreground` pair for soft surfaces (callouts, diff lines, badge and button variants).
   - `--radius` — the `rounded-sm`…`rounded-xl` scale only. Element corners are named tokens in `styles/shape.css` (`rounded-control` pills, `rounded-card`/`rounded-row`/`rounded-menu` 1rem, `rounded-panel` 1.5rem); escape that file to change them, and use those names rather than raw `rounded-md` in new elements.
   - Sidebar / chart tokens if you want deeper tweaks.
3. Save — the dev server applies immediately.

Whole-site contrast is audited: light mode targets blue-600, dark mode targets blue-500. Keep new token values AA-compliant on both backgrounds (≥4.5:1 for text).

## Typical workflow: add a page

Custom routes use [TanStack Router](https://tanstack.com/router). Minimal example:

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "livemark/components/Layout"

export const Route = createFileRoute("/about")({
  component: () => (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16 prose">
        <h1>About</h1>
        <p>Hello.</p>
      </div>
    </Layout>
  ),
})
```

A custom route renders **bare**: the root wraps every route in the headless `components/Root.tsx`, and only the Markdown route, 404 and error pages add chrome. Pick it per route:

- `<Layout>` — banner, header, sidebar sheet and back-to-top, as articles get (`withSidebar` adds the article sidebar)
- `<Banner />` + `<Header />` — a landing page's chrome without the sidebar; on phones `Header` opens `HeaderMenu`, a flat list of the header sections and links
- nothing — a fully custom page

`Header` never reads sidebar context: `Layout` passes its `SidebarTrigger`s in as the `toggle` and `menu` slots. A `Header` without `toggle` keeps its title block at sidebar width so the nav lines up with article pages.

Filename maps to URL path: `.livemark/routes/pricing.tsx` → `/pricing/`. Nested paths work via nested folders.

An `index.tsx` in `.livemark/routes/` **replaces** Livemark's default landing at `/`. For what to put on it, load `livemark-landing`.

Custom routes win over the Markdown catch-all at exact URLs. Don't create a route that collides with an article URL unless you intend to hide the article.

## Rules of thumb

1. **Don't fork the repo** for routine customization. Use `.livemark/` first — it reliably survives Livemark upgrades.
2. **Same filename, same path under `.livemark/`.** The override plugin is case-sensitive and mirrors the subdirectory structure exactly.
3. **Override files are full replacements**, not diffs. Copy the default first (via `escape`), then edit.
4. **Import Livemark internals via `livemark/*`**, not via relative paths — the plugin resolves those to the project's copy, so chained overrides (e.g., your Layout using your Header) compose correctly.
5. **Static files belong in `.livemark/public/`**, which Vite exposes at the site root.
6. **Never edit `.livemark/.serve/` or `.livemark/.build/`** — they are the generated mounts Vite runs for the dev server and the production build (Livemark's source with your overrides copied in), rebuilt on every run, so stack traces point there but edits are lost. Each carries its own `.gitignore`.
7. **Keyboard shortcuts live in the component they drive** — bare keys through `@tanstack/react-hotkeys`, ignored while typing: `L` sidebar (`Sidebar`), `S` search (`Search`), `T` theme (`Theme`), `J`/`K` scroll (`Root`), `B` back to top (`BackToTop`). Overriding one of these drops its key unless the copy keeps the `useHotkey` call; register a key in a component that mounts once, or one press fires twice.
8. **Search highlights live in `Article`** — picking a result opens the page with `?highlight=<query>`, and `Article` passes it to `useSearchHighlight` with a ref on its `.prose` wrapper. An overridden `components/Article.tsx` must keep that call and ref, or matches stop being marked. Theme the mark through the `--highlight` and `--highlight-foreground` tokens; code blocks are never marked.
9. **Edited Markdown reaches the page through `router.tsx`** — articles are route loader data, and route HMR keeps loader data, so `getRouter` re-runs loaders on Vite's `vite:afterUpdate`. An overridden `router.tsx` must keep that hook, or Markdown edits show only after a reload.

## Head tags

Add tags with the config `head` field (`livemark-configuration`); escape `head.ts` only to drop or rewrite defaults. `customizeHead` receives the finished `RootHead` (`meta`, `links`, `scripts`, typed from `livemark`) and returns it — mutate or filter, never rebuild, or later Livemark defaults are lost. Per-page `title`, `description`, `og:*` and canonical come from the article route and win over root meta with the same `name`/`property`.

## What's NOT overridable

- `actions/`, `commands/`, `program.ts` — server/CLI code. Fork upstream if you need to change these.
- `livemark.config.ts` schema — fixed.
- Content-collections transform pipeline. Customize markdown via remark/rehype plugins in a fork (or PR upstream).

## Verification

- The project's type check (e.g. `npx tsc --noEmit`) — confirms overrides typecheck. `livemark:virtual` types load through `livemark.config.ts`'s import of `livemark`; a program without that file adds `/// <reference types="livemark/env" />`. Never hand-declare the module.
- `npx livemark build` — smoke-test the override lands in the bundle.
- Browser: load an article page with the dev server; custom Footer/Sidebar/etc. should render without a full reload.

## References

- Narrative docs: `docs/customization/file-overrides.md`, `docs/customization/custom-routes.md`.
- Plugin implementation: `source/plugins/vite-livemark.ts`.
- Escape command: `commands/escape.ts`; list and copy logic in `actions/escape/`.
- Subpath exports: `package.json` `exports` block.
