---
title: Custom Routes
description: Author new pages in .livemark/routes/ alongside your markdown content.
icon: route
order: 8
path: /customization/custom-routes/
---

# Custom Routes

Livemark builds on [TanStack Router](https://tanstack.com/router). Any `.tsx` file you drop into `.livemark/routes/` becomes a page at the matching URL — no registration, no config change.

## Minimal example

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose">
      <h1>About</h1>
      <p>Anything you'd write in a normal React page, here.</p>
    </main>
  )
}
```

Save and visit `/about/`. The page renders inside the default layout (header + sidebar chrome), so the site title, navigation links, and dark-mode toggle all work automatically.

## How it fits with the rest of the site

- **Exact paths win.** Custom routes take precedence over the catch-all that serves Markdown articles. If you create `/about`, a `docs/about.md` article at the same path becomes unreachable.
- **The root path `/`.** Drop `.livemark/routes/index.tsx` to replace the default landing page with your own. Livemark's default site has a Markdown home page — overriding it gives you full React control of the hero.
- **Nested paths.** File paths mirror URL paths: `.livemark/routes/guide/quickstart.tsx` ⇒ `/guide/quickstart/`.

## Importing Livemark primitives

Reuse the same components Livemark uses internally via the `livemark/*` subpath exports:

```tsx title=".livemark/routes/about.tsx"
import { Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "livemark/elements/button"
import { cn } from "livemark/helpers/style"

export const Route = createFileRoute("/about")({ component: About })

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <Link
        to="/"
        className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
      >
        ← Back home
      </Link>
    </main>
  )
}
```

## Static assets

Files placed in `.livemark/public/` are served at the site root. Put a `robots.txt`, a custom `favicon.svg`, or an `/og-image.png` there.

## See also

- [File Overrides](/customization/file-overrides/) — replace a built-in page or component instead of adding a new one.
- [Site Metadata](/customization/site-metadata/) — the site title and favicon that show on custom routes too.
