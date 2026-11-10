---
description: Render Markdown with Livemark's pipeline and components inside your own Vite or TanStack Start app.
path: /customization/standalone/
icon: package
order: 13
---

# Standalone Markdown

Livemark's Markdown pipeline and article components ship on their own as `@livemark/vite`. An app built on Vite, such as a TanStack Start app with a blog, can import `.md` and `.mdx` files and render them with the same callouts, tabs, code blocks and cards as a Livemark article, without installing Livemark itself.

```bash
npm install @livemark/vite
```

## The Vite plugin

```ts title="vite.config.ts"
import markdown from "@livemark/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [markdown()],
})
```

Every imported `.md` or `.mdx` file becomes a module that exports:

- `default`: the content as a React component, rendered with Livemark's components
- `frontmatter`: the file's YAML frontmatter
- `toc`: its h2 to h4 headings as `{ url, title, depth }`

A file compiles the way Livemark compiles an article: `.md` as Markdown, `.mdx` as MDX, and a `format: md` or `format: mdx` in its frontmatter wins over the extension.

| Option               | Default            | What it does                                                       |
| -------------------- | ------------------ | ------------------------------------------------------------------ |
| `include`            | `/\.mdx?$/`        | The module ids to compile, as globs or regular expressions         |
| `exclude`            |                    | The module ids to leave alone                                      |
| `codeThemeLight`     | `catppuccin-latte` | The [syntax theme](/customization/syntax-themes/) in light mode    |
| `codeThemeDark`      | `catppuccin-mocha` | The syntax theme in dark mode                                      |
| `plugins`            |                    | `{ md, html }` [plugins](/customization/plugins/), as in a site    |
| `allowDangerousHtml` | `true`             | `false` drops all raw HTML and fails on any file that would be MDX |
| `root`, `base`       |                    | Resolve relative image URLs from `root` and serve them at `base`   |

Set `allowDangerousHtml: false` for content you do not fully trust: Markdown cannot run code, while MDX can. React blocks links with a `javascript:` URL when the content renders. The plugin also warns, through Vite, about what renders silently wrong, such as an unknown directive.

For TypeScript, reference the module types once:

```ts title="env.d.ts"
/// <reference types="@livemark/vite/env" />
```

## Rendering

```tsx title="routes/blog/post.tsx"
import { MessagesProvider } from "@livemark/vite/react"
import Post from "./post.md"

export function PostPage() {
  return (
    <MessagesProvider messages={{ "callout.note": "Nota" }}>
      <article className="prose dark:prose-invert">
        <Post />
      </article>
    </MessagesProvider>
  )
}
```

Pass `components` to replace any of Livemark's components for one render, such as `<Post components={{ a: RouterLink }} />`.

- **`MessagesProvider`** supplies the UI strings the components show, such as callout titles and the copy button's label. A key you leave out stays in English. The keys are a language's [`messages`](/customization/translations/).
- **`IconsProvider`** from `@livemark/vite/react` supplies the icons `:icon` and `:::card{icon}` render, by their Lucide key: pass lucide-react's `icons` or a subset of it. Without one, no icon renders.

## Styles

The components are shipped as source, so your Tailwind CSS v4 build compiles their classes. One stylesheet loads the Markdown styles and points Tailwind at the components:

```css title="app.css"
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@livemark/vite/styles.css";
@custom-variant dark (&:is(.dark *));
```

The components use these theme tokens, which your CSS defines as `--color-*` under `@theme` (see [Livemark's values](https://github.com/datisthq/livemark/blob/main/markdown/source/styles/general.css)):

- `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`
- `primary`, `secondary`, `muted`, `accent`, each with its `-foreground`
- `border`, `input`, `ring`
- `positive`, `warning` and `destructive`, each with `-tint` and `-tint-foreground`

Their corners use the `rounded-card` and `rounded-control` scale the stylesheet defines.
