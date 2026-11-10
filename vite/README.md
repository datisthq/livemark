# @livemark/vite

Render Markdown and MDX with Livemark's pipeline and article components in any Vite app: import
a `.md` or `.mdx` file and render it with the same callouts, tabs, code blocks and cards as a
[Livemark](https://livemark.dev) site.

```ts
// vite.config.ts
import markdown from "@livemark/vite"

export default { plugins: [markdown({ allowDangerousHtml: false })] }
```

```tsx
import Post, { frontmatter, toc } from "./post.md"

export function PostPage() {
  return <Post />
}
```

Docs: [livemark.dev/markdown-vite-plugin](https://livemark.dev/markdown-vite-plugin/)
