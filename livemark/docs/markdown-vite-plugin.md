---
description: Render Markdown with Livemark's pipeline and components inside your own Vite and React app.
label: Vite Plugin
path: /markdown-vite-plugin/
icon: package
order: 7
---

# Markdown Vite Plugin

Livemark's Markdown pipeline and article components ship on their own as `@livemark/vite`. Any React app built on Vite can import `.md` and `.mdx` files and render them with the same callouts, tabs, code blocks and cards as a Livemark article, without installing Livemark itself.

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
| `collections`        |                    | Collections to serve as virtual modules                            |

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

## Collections

A blog index, a tag page or a sitemap needs every post's frontmatter without loading every post. A collection lists a set of files without their bodies and loads each body on demand:

```ts title="vite.config.ts"
import markdown, { defineCollection } from "@livemark/vite"
import { defineConfig } from "vite"
import { Post } from "./post.ts"

export const blog = defineCollection({
  name: "blog",
  include: "content/blog/**/*.md",
  schema: Post,
})

export default defineConfig({
  plugins: [markdown({ collections: [blog] })],
})
```

The app imports it as `virtual:livemark/collection/<name>`:

```tsx title="routes/blog/post.tsx"
import { lazy } from "react"
import { entries, load } from "virtual:livemark/collection/blog"

const posts = entries.map(entry => ({ ...entry, Body: lazy(() => load(entry.id)) }))
```

- **`entries`** lists every file, sorted by path, as `{ id, file, frontmatter, readingTime }`. `readingTime` is in minutes at 200 words a minute, code blocks left out. It holds no bodies, so an index stays small.
- **`load(id)`** imports one entry's compiled module, which is the same module importing the file gives. Each file becomes its own chunk, and an unknown id rejects.

| Option    | Default                      | What it does                                                       |
| --------- | ---------------------------- | ------------------------------------------------------------------ |
| `name`    |                              | The module's name: letters, digits, `_` and `-`                    |
| `include` |                              | The `.md` and `.mdx` files, as globs relative to `root`            |
| `exclude` |                              | The files left out, as globs relative to `root`                    |
| `root`    | the working directory        | The directory the globs and `file` count from                      |
| `schema`  |                              | Validates each file's frontmatter: a zod schema or any `{ parse }` |
| `id`      | `file` without its extension | An entry's id from its `file`, e.g. `file => file.split("/")[2]`   |

A frontmatter that fails `schema` fails the build and names the file, and so does an id two files share. `entries` is serialized as JSON, so a schema that turns a date into a `Date` gives a string in the app.

`blog.list()` returns the same entries from Node, without Vite: a config can enumerate the pages to prerender with it. A collection's files compile even when the plugin's `include` or `exclude` leaves them out. In the dev server, an edit that changes `entries` reloads the page, while an edit to a body updates as usual.

For typed frontmatter, declare the module once, beside the env reference:

```ts title="env.d.ts"
declare module "virtual:livemark/collection/blog" {
  import type { CollectionEntry, MarkdownModule } from "@livemark/vite"
  import type { Post } from "./post.ts"
  export const entries: CollectionEntry<Post>[]
  export function load(id: string): Promise<MarkdownModule>
}
```

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
