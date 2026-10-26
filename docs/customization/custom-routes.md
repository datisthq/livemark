---
title: Custom Routes
description: Author new pages in .livemark/routes/ alongside your markdown content.
path: /customization/custom-routes/
icon: route
order: 7
---

# Custom Routes

Livemark builds on [TanStack Router](https://tanstack.com/router). Any `.tsx` file you drop into `.livemark/routes/` becomes a page at the matching URL — no registration, no config change.

## Minimal example

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "livemark/components/Layout"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16 prose">
        <h1>About</h1>
        <p>Anything you'd write in a normal React page, here.</p>
      </div>
    </Layout>
  )
}
```

Save and visit `/about/`. `Layout` gives the page the same chrome as an article — banner, header, navigation and dark-mode toggle.

## Choosing the chrome

A custom route starts **bare**: nothing is drawn around it until you add it. Compose as much as the page needs:

| You render                  | You get                                                        |
| --------------------------- | -------------------------------------------------------------- |
| `<Layout>`                  | banner, header, phone navigation sheet, back-to-top            |
| `<Layout withSidebar>`      | the above plus the article sidebar                             |
| `<Banner />` + `<Header />` | the banner and header alone — on phones a menu of the sections |
| nothing                     | a blank page, all yours                                        |

A landing page usually wants just the header:

```tsx title=".livemark/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main>{/* your hero */}</main>
    </>
  )
}
```

## How it fits with the rest of the site

- **Exact paths win.** Custom routes take precedence over the catch-all that serves Markdown articles. If you create `/about`, a `docs/about.md` article at the same path becomes unreachable.
- **The root path `/`.** Drop `.livemark/routes/index.tsx` to replace the default landing page with your own. Livemark's default site has a Markdown home page — overriding it gives you full React control of the hero.
- **Nested paths.** File paths mirror URL paths: `.livemark/routes/guide/quickstart.tsx` ⇒ `/guide/quickstart/`.

## Importing Livemark primitives

Reuse the same components Livemark uses internally via the `livemark/*` subpath exports:

```tsx title=".livemark/routes/about.tsx"
import { Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "livemark/elements/button"
import { cn } from "cn"

export const Route = createFileRoute("/about")({ component: About })

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <Link to="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
        ← Back home
      </Link>
    </main>
  )
}
```

## Static assets

Files placed in `.livemark/public/` are served at the site root. Put a `robots.txt`, a custom `favicon.svg`, or an `/og-image.png` there.

## See also

- [Escaping](/customization/overriding-escaping/) — replace a built-in page or component instead of adding a new one.
- [Site Metadata](/customization/site-metadata/) — the site title and favicon that show on custom routes too.
