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

## Media

### Image Zooming

All images in articles are zoomable — click any image to expand it to full size. This works with internal, external, and base64 images.

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

### Video Blocks

Embed videos using the `::video` directive with a `type` attribute:

```md
::video{type="youtube" id="dQw4w9WgXcQ"}
```

Renders as:

::video{type="youtube" id="dQw4w9WgXcQ"}

### Audio Blocks

Embed audio using the `::audio` directive with a `type` attribute:

```md
::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
```

Renders as:

::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}

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

### Footnotes

Add footnotes using `[^id]` references and definitions:

```md
Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.
```

Renders as:

Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.

## Rich Elements

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

GitHub syntax:

```md
> [!TIP]
> GitHub syntax also works.
```

Directive syntax:

```md
:::note
This is a note.
:::
```

Custom title:

```md
:::warning[Breaking Change]
This API has been removed in v2.
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

:::warning[Breaking Change]
This API has been removed in v2.
:::

### Expandable

Create expandable content using the `:::details` directive:

```md
:::details[Click to expand]
Hidden content here with **markdown** support.
:::
```

Renders as:

:::details[Click to expand]
Hidden content here with **markdown** support.
:::

You can nest any markdown inside, including code blocks, lists, and callouts:

:::details[Configuration example]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  articles: { include: "docs/*.md" },
})
```

:::

### Tabs

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

### Steps

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

### Cards

Create content cards using the `:::card` directive. Consecutive cards are automatically grouped into a grid.

```md
:::card{title="Getting Started" href="/getting-started" icon="rocket"}
Learn how to set up your first project.
:::
```

```md
:::card{title="Configuration" href="/configuration" icon="layers"}
Configure your Livemark project.
:::
```

Renders as:

:::card{title="Getting Started" href="/docs%2Fgetting-started" icon="rocket"}
Learn how to set up your first project.
:::

:::card{title="Configuration" href="/docs%2Fconfiguration" icon="layers"}
Configure your Livemark project.
:::

:::card{title="GitHub" href="https://github.com/datisthq/livemark" icon="github"}
View the source code on GitHub.
:::

:::card{title="Markdown" icon="file-code"}
This page documents all markdown features.
:::

### Badges

Inline status badges using the `:badge` directive:

```md
:badge[Beta] :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}
```

Renders as:

:badge[Beta] :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}

### Icons

Inline icons from the Lucide library using the `:icon` directive:

```md
:icon{name="rocket"} Launch :icon{name="check"} Done :icon{name="heart"} Love
```

Renders as:

:icon{name="rocket"} Launch :icon{name="check"} Done :icon{name="heart"} Love

With Tailwind colors:

```md
:icon{name="check" className="text-green-500"} Pass :icon{name="x" className="text-red-500"} Fail :icon{name="star" className="text-yellow-500"} Star
```

Renders as:

:icon{name="check" className="text-green-500"} Pass :icon{name="x" className="text-red-500"} Fail :icon{name="star" className="text-yellow-500"} Star

### File Tree

Display file and directory structures using the `:::filetree` directive. Directories are indicated with a trailing `/`:

```md
:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json
  :::
```

Renders as:

:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json

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

Highlight specific lines with `{line,range}` syntax in the meta string or `// [!code highlight]` comments inside the code block.

Using meta syntax:

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

Using comment syntax (`// [!code highlight]`):

````md
```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```
````

Renders as:

```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```

Comment annotations are removed from the rendered output. Block comment syntax `/* [!code highlight] */` is also supported.

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

### Diff Lines

Mark lines as added or removed using `// [!code ++]` and `// [!code --]`:

````md
```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```
````

Renders as:

```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```

### Focus Lines

Dim all other lines except the focused ones with `// [!code focus]`:

````md
```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```
````

Renders as:

```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```

### Error and Warning Lines

Mark lines as errors or warnings with `// [!code error]` and `// [!code warning]`:

````md
```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```
````

Renders as:

```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```

### Language Icons

Code blocks automatically display a language icon in the title bar when a title is present. Supported languages include TypeScript, JavaScript, React, Python, Rust, and shell.

```typescript title="example.ts"
const greeting = "hello"
```

```python title="example.py"
greeting = "hello"
```

```rust title="example.rs"
let greeting = "hello";
```

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

## Advanced Syntax

### HTML Blocks

Standard HTML tags are supported directly in markdown files. Common examples include `<kbd>` for keyboard shortcuts, `<sup>`/`<sub>` for superscripts and subscripts, and `<details>`/`<summary>` for accordions.

```md
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy. Water is H<sub>2</sub>O.
```

Renders as:

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy. Water is H<sub>2</sub>O.

Since Livemark uses MDX, HTML attributes follow JSX conventions: use `className` instead of `class`, and `style` takes an object instead of a string.

Tailwind CSS 4 utility classes are available in HTML blocks via `className`:

```md
<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
  A styled container using Tailwind utilities.
</div>
```

Renders as:

<div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
  A styled container using Tailwind utilities.
</div>

### MDX Rendering

Livemark uses MDX under the hood, so JSX expressions and components can be used directly in markdown files when needed:

```md
export const version = "2.0.0"

The current version is **{version}**.
```

You can also import modules:

```md
import { authors } from "./data.ts"

{authors.map(a => <span key={a.name}>{a.name}</span>)}
```

This is an escape hatch for advanced use cases. Prefer standard markdown and directive syntax when possible.

### LaTeX Expressions

LaTeX math expressions are supported via KaTeX.

Inline math uses single dollar signs: `$E = mc^2$` renders as $E = mc^2$. Use it for variables like $x$, $\alpha$, or expressions like $\sum_{i=1}^{n} i$.

Display math uses double dollar signs for centered, block-level equations:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

Matrices and aligned equations:

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}
$$

### Mermaid Diagrams

Render diagrams using Mermaid syntax. Diagrams automatically adapt to light and dark themes.

````md
```mermaid
graph LR
    A[Markdown] --> B[Remark]
    B --> C[Rehype]
    C --> D[HTML]
```
````

Renders as:

```mermaid
graph LR
    A[Markdown] --> B[Remark]
    B --> C[Rehype]
    C --> D[HTML]
```

````md
```mermaid
pie title Languages
    "TypeScript" : 45
    "Python" : 30
    "Rust" : 15
    "Other" : 10
```
````

Renders as:

```mermaid
pie title Languages
    "TypeScript" : 45
    "Python" : 30
    "Rust" : 15
    "Other" : 10
```

### Included Documents

Reference content from other markdown files using the `::include` directive. Frontmatter in included files is automatically stripped.

For example, `::include{file="./includes/disclaimer.md"}`

Renders as:

::include{file="./includes/disclaimer.md"}

Paths are resolved relative to the current file. Nested includes are supported up to 5 levels deep.
