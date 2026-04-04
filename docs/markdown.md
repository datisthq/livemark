---
icon: file-code
order: 2
---

# Markdown

Livemark uses MDX under the hood, combining standard Markdown with JSX capabilities. You can use all standard Markdown features plus the extensions documented below.

## Frontmatter

YAML-based frontmatter is supported at the top of each file:

```yaml
---
title: My Page
description: A brief description of the page.
icon: rocket
---
```

All the fields are optional.

## Headings

Headings automatically generate anchor IDs for linking.

### Auto-generated IDs

```md
## My Heading
```

Renders as `<h2 id="my-heading">My Heading</h2>`. IDs are generated using GitHub-compatible slugging.

### Custom Heading IDs [#custom-ids]

Override the auto-generated ID with `[#custom-id]` syntax:

```md
## My Heading [#custom-id]
```

This generates `<h2 id="custom-id">My Heading</h2>`. Link to it with `#custom-id`. This heading itself uses `[#custom-ids]`.

### Heading Levels

Use h2–h4 for content structure. The h1 is reserved for the page title.

Deeper headings (h5, h6) are supported but won't appear in the table of contents.

### Anchor Links on Hover

Headings with IDs show a link icon on hover. Click to copy the anchor URL for sharing.

## Links

### Internal Links

Link to other pages in your documentation:

```md
[Getting Started](/docs%2Fgetting-started/)
```

Renders as: [Getting Started](/docs%2Fgetting-started/)

### External Links

Link to external resources:

```md
[GitHub](https://github.com)
```

Renders as: [GitHub](https://github.com)

### Anchor Links

Link to a specific heading on the current page:

```md
[See Custom Heading IDs](#custom-ids)
```

Renders as: [See Custom Heading IDs](#custom-ids)

### Auto Links

URLs are automatically converted to links:

```md
https://github.com/datisthq/livemark
```

Renders as: https://github.com/datisthq/livemark

## Images

### Internal Images

Reference images from your docs directory:

```md
![Example image](./images/example.jpg)
```

Renders as:

![Example image](./images/example.jpg)

### External Images

Reference images from external URLs:

```md
![Placeholder](https://picsum.photos/seed/livemark/800/300)
```

Renders as:

![Placeholder](https://picsum.photos/seed/livemark/800/300)

## Text Formatting

### Bold and Italic

```md
**bold text** and *italic text* and ***bold italic***
```

Renders as: **bold text** and *italic text* and ***bold italic***

### Strikethrough

```md
~~deleted text~~
```

Renders as: ~~deleted text~~

### Inline Code

```md
Use `const x = 1` for inline code.
```

Renders as: Use `const x = 1` for inline code.

### Blockquotes

```md
> This is a blockquote.
```

Renders as:

> This is a blockquote.

### Lists

Unordered and ordered lists:

- First item
- Second item
  - Nested item

1. Step one
2. Step two
3. Step three

### Task Lists

```md
- [x] Completed task
- [ ] Pending task
```

Renders as:

- [x] Completed task
- [ ] Pending task

### Horizontal Rules

```md
---
```

---

### Tables

```md
| Feature    | Status    |
| ---------- | --------- |
| Tables     | Supported |
| Task lists | Supported |
```

Renders as:

| Feature    | Status    |
| ---------- | --------- |
| Tables     | Supported |
| Task lists | Supported |

### Callouts

Callouts highlight important information. Available types: note, tip, info, warning, danger.

Directive syntax:

````md
:::note
This is a note.
:::
````

GitHub syntax:

````md
> [!TIP]
> GitHub syntax also works.
````

Renders as:

:::note
This is a note.
:::

:::tip
Helpful advice here.
:::

:::warning
Be careful with this.
:::

:::danger
Critical warning!
:::

:::info
Additional context.
:::

## Code Blocks

Fenced code blocks are syntax-highlighted with Shiki using catppuccin themes.

### Titles

Add a filename or title to code blocks:

````md
```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"
```
````

Renders as:

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  articles: { include: "docs/*.md" },
})
```

### Line Highlighting

Highlight specific lines with `{line,range}` syntax:

````md
```typescript {2,4-6}
const a = 1
const b = 2
```
````

Renders as:

```typescript {2,4-6}
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

### Language Icons

Code blocks automatically display a language icon in the title bar when a title is present. Supported languages include TypeScript, JavaScript, React, Python, Rust, and shell.

### NPM Commands

Write npm commands and get automatic tabs for all package managers:

````md
```npm
npm install livemark
```
````

Renders as:

```npm
npm install livemark
```

## Special Syntax

### Math Expressions

LaTeX math expressions are supported via KaTeX.

Inline: `$x^2$` renders as $x^2$.

Display math uses double dollar signs:

$$
E = mc^2
$$

### Mermaid Diagrams

TBD

## Planned Features

:::info
The following features are planned but not yet supported.
:::

- **Line Numbers** — display line numbering in code blocks
- **Shiki Transformers** — comment-based highlighting, diffs, and focus effects
- **Code Tab Groups** — group code blocks into tabs via meta strings
- **Steps** — step-by-step guide annotations on headings
- **Cards** — card grid components for related pages
- **Tabs** — generic tabbed content panels
- **Accordions** — collapsible content sections
- **Image Zoom** — click-to-zoom image viewing
- **Include** — reference content from other markdown files
