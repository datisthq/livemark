---
name: livemark-landing
description: Use when designing or rewriting a Livemark project's landing page at .livemark/routes/index.tsx — section structure, hero, screenshots, motion and theming, taking livemark.dev's own landing as the reference.
---

# Livemark Landing

Guidance for designing the page at `/` of a Livemark project. The mechanics of a custom route — the file, the chrome, the imports — are in `livemark-customization`; this skill is about what goes on the page.

## When to use this skill

Invoke when the user asks to:

- Build a landing, home or marketing page for the site, or redesign the existing one.
- Add a hero, feature grid, screenshot carousel, comparison or call-to-action section.
- Make the landing look as polished as livemark.dev.

## Start from the reference

livemark.dev's landing is itself a Livemark custom route, built only from public `livemark/*` exports. Read it before writing anything, see it live, and borrow its structure:

- Live: https://livemark.dev/
- Source: https://github.com/datisthq/livemark/blob/main/.livemark/routes/index.tsx

It is not in the npm package, so fetch it from GitHub. Take the patterns, not the content: rewrite every heading and line of copy for the project, and use the project's own screenshots and links. Shipping Livemark's copy, screenshots or Datist credit on someone else's site is a bug.

## Skeleton

```tsx title=".livemark/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { BackToTop } from "livemark/components/BackToTop"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Features />
        <FinalCta />
      </main>
      <BackToTop />
    </>
  )
}
```

The reference runs Hero → a differentiator ("Stays out of your way") → a feature grid → show-don't-tell (Markdown source beside its rendered page) → an audience section (agents) → a final call to action → a credit strip. Pick the sections the project has something real to say in; three strong ones beat seven thin ones.

## Patterns from the reference

- **Section shell** — `<section className="border-b border-border">` around `mx-auto max-w-6xl px-6 py-24`, a centred heading block (`max-w-2xl`, `h2` at `text-3xl md:text-4xl`), and one showcase section tinted with `bg-primary/5` to break the rhythm. Two-column sections pair a text list with a visual: `grid grid-cols-1 md:grid-cols-2`.
- **Hero** — a small uppercase eyebrow in `text-primary`, a short `h1`, a lede capped at `max-w-[52ch]`, then two actions: a primary button to the docs and an outline one to the source. Buttons are `buttonVariants` from `livemark/elements/button` on a `Link` or `<a>`, plus `no-underline`.
- **Internal links** go through `<Link to="/$" params={{ _splat: "introduction" }}>`, so `base` and client navigation keep working; external links get `target="_blank" rel="noopener noreferrer"`.
- **Show the product** — real screenshots, not stock art. Each shot ships light and dark as two `<img>`, toggled with `dark:hidden` / `hidden dark:block`: the theme is a class on `<html>`, which `<picture media>` cannot see. Put them in `.livemark/public/` and reference them from `/`.
- **Window cards** — a bordered `rounded-card` frame with a title bar and a mono file label (`WindowCard`) makes code, file trees and rendered output read as the real thing.
- **Data-driven repeats** — features and points are typed arrays (`icon`, `title`, `description`) mapped into cards, so copy edits never touch markup. Icons come from `lucide-react`.
- **Tokens, not colours** — `text-primary`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-card`. A rebrand in `styles/general.css` then reaches the landing too. Hardcoded hex is only for syntax-coloured samples, always with a `dark:` pair.
- **Motion** — sections fade up on scroll through a small `Reveal` wrapper over `useInView` from `livemark/hooks/in-view`, with a `delayMs` stagger for list items; the hero uses `animate-in fade-in-0 slide-in-from-bottom-4`. Page-local keyframes go in a React `<style href="…" precedence="default">` tag.

## Rules of thumb

1. **Every animation honours reduced motion** — `motion-reduce:` utilities or a `@media (prefers-reduced-motion: reduce)` block, as the reference's carousel and background do.
2. **Phone first.** Grids start at one column, action rows `flex-wrap`, secondary labels are `hidden sm:inline`. Check 375px wide: no horizontal scroll.
3. **Prerender-safe.** `/` is rendered at build time, so nothing touches `window` or `document` during render — only in effects and handlers.
4. **Import via `livemark/*`** (`components`, `elements`, `hooks`), never relative paths into `node_modules`, so escaped components compose.
5. **One file is fine.** Keep the landing in `index.tsx`; move a piece to `.livemark/components/` only when another route reuses it.

## Verification

- `npx livemark start`, open `/` in light and dark, at phone width, and with reduced motion emulated.
- `npx livemark build` — confirms `/` prerenders without touching browser globals.
- Every link and button resolves; screenshots load in both themes.

## References

- Reference landing: https://github.com/datisthq/livemark/blob/main/.livemark/routes/index.tsx.
- Custom routes and chrome: https://livemark.dev/customization/custom-routes/ and `livemark-customization`.
- Theming tokens: `livemark-customization`, "Typical workflow: rebrand".
