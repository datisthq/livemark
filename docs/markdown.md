---
icon: file-code
order: 3
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

### Article Metadata

TBD

### Sidebar Settings

TBD

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

### TOC Control

Control whether headings appear in the table of contents using annotations.

Hide a heading from the TOC while keeping it visible in the rendered output:

```md
## Visible Heading [!toc]
```

The heading renders normally on the page but is excluded from the table of contents.

Create a TOC-only heading that appears in the table of contents but not in the rendered output:

```md
## Hidden Heading [toc]
```

The heading appears in the TOC for navigation but is removed from the page content.

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

### Base64 Images

Embed small images directly using data URIs:

```md
![banner](data:image/png;base64,iVBORw0KGgo...)
```

Renders as:

![banner](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABQCAIAAADTD63nAAABU0lEQVR4nO3csU3DUBRAUUCIGVJlHLcwAVV2YIbsQJUJUmccJCRmoKKgthOR3IDNOe138WxdveZLvn0c3m/g0u5+ewCWSVgkhEVCWCSERUJYJIRFQlgkhEXifvr47eP1OnMwR+vVZuzIxiJxZGN9e3p+qedgXva77fQDNhYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGROOkSeswwPFxqjr/jcPgcO1rk+06b+BrTbCwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIicdZvjH78j5uZ+m/vew4bi4SwSAiLhLBICIuEsEgIi4SwSAiLhLBICIuEsEicdAm9323rOVgYG4vEkY21Xm2uMwcLY2OREBYJYZEQFglhkRAWCWGREBaJL1tnFXf+b+eSAAAAAElFTkSuQmCC)

## Text Formatting

### Bold and Italic

```md
**bold text** and _italic text_ and **_bold italic_**
```

Renders as: **bold text** and _italic text_ and **_bold italic_**

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

```md
:::note
This is a note.
:::
```

GitHub syntax:

```md
> [!TIP]
> GitHub syntax also works.
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

### Accordions

Collapsible content sections using native HTML `<details>` and `<summary>`:

```md
<details>
<summary>Click to expand</summary>

Hidden content here with **markdown** support.

</details>
```

Renders as:

<details>
<summary>Click to expand</summary>

Hidden content here with **markdown** support.

</details>

You can nest any markdown inside, including code blocks, lists, and callouts:

<details>
<summary>Configuration example</summary>

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  articles: { include: "docs/*.md" },
})
```

</details>

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

### Word Highlighting

Highlight all occurrences of a word with `{word:TERM}` syntax:

````md
```typescript {word:config}
const config = loadConfig()
export default config
```
````

Renders as:

```typescript {word:config}
const config = loadConfig()
export default config
```

### Line Numbers

Display line numbers alongside code with `lineNumbers`:

````md
```typescript lineNumbers
const a = 1
const b = 2
```
````

Renders as:

```typescript lineNumbers
const a = 1
const b = 2
const c = 3
```

Start numbering from a specific line with `lineNumbers=N`:

````md
```typescript lineNumbers=5
const a = 1
const b = 2
```
````

Renders as:

```typescript lineNumbers=5
const a = 1
const b = 2
const c = 3
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

## Tabs

### Code Block Tabs

Group consecutive code blocks into tabs using `tab="name"` meta:

````md
```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```
````

Renders as:

```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```

### Generic Tabs

Use `Tabs` components directly in MDX for any tabbed content:

<Tabs defaultValue="react">
  <TabsList>
    <TabsTrigger value="react">React</TabsTrigger>
    <TabsTrigger value="vue">Vue</TabsTrigger>
  </TabsList>
  <TabsContent value="react">

React uses JSX for templating and hooks for state management.

  </TabsContent>
  <TabsContent value="vue">

Vue uses single-file components with template, script, and style sections.

  </TabsContent>
</Tabs>

## Steps

Add `[step]` to headings to create numbered step-by-step guides:

```md
### Install Dependencies [step]

Run `npm install` to add all required packages.

### Configure Project [step]

Create a config file in the project root.

### Deploy [step]

Push to production.
```

Renders as:

### Install Dependencies [step]

Run `npm install` to add all required packages.

### Configure Project [step]

Create a config file in the project root.

### Deploy [step]

Push to production.

## Cards

### Single Card

Use the `Card` component for standalone content cards:

<Card title="Livemark">
  A fast, modern site generator built on TanStack Start and MDX.
</Card>

### Multiple Cards

Use `Cards` with `href` to create navigable card grids:

<Cards>
  <Card title="Getting Started" href="/docs%2Fgetting-started/">
    Learn how to set up your first project.
  </Card>
  <Card title="Configuration" href="/docs%2Fconfiguration/">
    Configure your Livemark project.
  </Card>
  <Card title="GitHub" href="https://github.com/datisthq/livemark">
    View the source code on GitHub.
  </Card>
  <Card title="Markdown">
    This page documents all markdown features.
  </Card>
</Cards>

## Special Syntax

### LaTeX Expressions

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

- **Shiki Transformers** — comment-based highlighting, diffs, and focus effects
- **Image Zoom** — click-to-zoom image viewing
- **Include** — reference content from other markdown files
