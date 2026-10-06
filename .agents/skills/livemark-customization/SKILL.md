---
name: livemark-customization
description: Use when overriding Livemark's built-in UI or adding custom routes — drop same-named files under .livemark/{components,elements,styles} to shadow defaults, author .livemark/routes/*.tsx for new pages, or copy defaults with the `livemark escape` command.
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

None require config changes. The Vite plugin (`website/plugins/vite-livemark.ts`) watches `.livemark/**` and hot-reloads.

## Discovering what's overridable

Run the `escape` command. No arg lists every overridable file:

```bash
livemark escape
```

Output is a flat `<subdir>/<file>` list across `components/`, `elements/`, and `styles/`. With an argument, the command copies the default into `.livemark/`:

```bash
livemark escape components/Footer.tsx   # → .livemark/components/Footer.tsx
livemark escape elements/button.tsx     # → .livemark/elements/button.tsx
livemark escape styles/general.css      # → .livemark/styles/general.css
```

The command refuses to overwrite an existing override. Delete the override first if you want a fresh start.

## Typical workflow: override a component

1. `livemark escape components/Footer.tsx` — copy the default.
2. Edit `.livemark/components/Footer.tsx`. All the site's Footer renders shift to the new file on save.
3. Inside the override, import other Livemark modules from the `livemark/<subdir>/*` subpath exports:
   ```tsx
   import { cn } from "livemark/helpers/style"
   import { Button } from "livemark/elements/button"
   ```

## Typical workflow: rebrand

1. `livemark escape styles/general.css`.
2. Edit the `:root` and `.dark` blocks in `.livemark/styles/general.css`:
   - `--primary` — brand accent (Tailwind-flavoured oklch values work).
   - `--radius` — corner roundness base.
   - Sidebar / chart tokens if you want deeper tweaks.
3. Save — the dev server applies immediately.

Whole-site contrast is audited: light mode targets blue-600, dark mode targets blue-500. Keep new token values AA-compliant on both backgrounds (≥4.5:1 for text).

## Typical workflow: add a page

Custom routes use [TanStack Router](https://tanstack.com/router). Minimal example:

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: () => (
    <main className="mx-auto max-w-3xl px-6 py-16 prose">
      <h1>About</h1>
      <p>Hello.</p>
    </main>
  ),
})
```

Filename maps to URL path: `.livemark/routes/pricing.tsx` → `/pricing/`. Nested paths work via nested folders.

An `index.tsx` in `.livemark/routes/` **replaces** Livemark's default landing at `/`.

Custom routes win over the Markdown catch-all at exact URLs. Don't create a route that collides with an article URL unless you intend to hide the article.

## Rules of thumb

1. **Don't fork the repo** for routine customization. Use `.livemark/` first — it reliably survives Livemark upgrades.
2. **Same filename, same path under `.livemark/`.** The override plugin is case-sensitive and mirrors the subdirectory structure exactly.
3. **Override files are full replacements**, not diffs. Copy the default first (via `escape`), then edit.
4. **Import Livemark internals via `livemark/*`**, not via relative paths — the plugin routes those through the override resolver, so chained overrides (e.g., your Layout using your Sidebar) compose correctly.
5. **Static files belong in `.livemark/public/`**, which Vite exposes at the site root.

## What's NOT overridable

- `actions/`, `commands/`, `program.ts` — server/CLI code. Fork upstream if you need to change these.
- `livemark.config.ts` schema — fixed.
- Content-collections transform pipeline. Customize markdown via remark/rehype plugins in a fork (or PR upstream).

## Verification

- `pnpm type` — confirms overrides typecheck.
- `pnpm docs:build` — smoke-test the override lands in the bundle.
- Browser: load an article page with the dev server; custom Footer/Sidebar/etc. should render without a full reload.

## References

- Narrative docs: `docs/customization/file-overrides.md`, `docs/customization/custom-routes.md`.
- Plugin implementation: `website/plugins/vite-livemark.ts`.
- Escape command: `commands/escape.ts`.
- Subpath exports: `package.json` `exports` block.
