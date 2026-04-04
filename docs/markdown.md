---
title: Markdown
description: Writing documents with Livemark's markdown features.
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

The `title` property is required. The `icon` and `description` fields are optional.

## Headings

Headings automatically generate anchor IDs for linking:

```md
## My Heading
```

Renders as `<h2 id="my-heading">My Heading</h2>`.

### Custom Heading IDs [#custom-ids]

Override the auto-generated ID with `[#custom-id]` syntax:

```md
## My Heading [#custom-id]
```

This generates `<h2 id="custom-id">My Heading</h2>`. Link to it with `#custom-id`. This heading itself uses `[#custom-ids]`.

## GFM Features

GitHub Flavored Markdown is fully supported:

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

### Task Lists

```md
- [x] Completed task
- [ ] Pending task
```

Renders as:

- [x] Completed task
- [ ] Pending task

### Strikethrough

```md
~~deleted text~~
```

Renders as: ~~deleted text~~

## Callouts

Callouts highlight important information. Two syntaxes are supported:

### Directive Syntax

```md
:::note
This is a note.
:::
```

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

### GitHub Syntax

```md
> [!NOTE]
> This is a note.
```

Renders as:

> [!NOTE]
> GitHub-style callouts work too.

> [!TIP]
> Helpful advice using GitHub syntax.

> [!WARNING]
> Be careful with this.

> [!CAUTION]
> Critical warning!

> [!IMPORTANT]
> Key information.

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

## NPM Commands

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

## Math

LaTeX math expressions are supported via KaTeX.

Inline: `$x^2$` renders as $x^2$.

Display math uses double dollar signs:

$$
E = mc^2
$$

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
