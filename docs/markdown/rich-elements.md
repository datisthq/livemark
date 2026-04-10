---
title: Rich Elements
icon: layout-grid
order: 6
pathname: /markdown/rich-elements/
---

# Rich Elements

## Tables

Standard GFM tables with sortable columns — click any header to sort:

```md
| Language   | Year | Typing  |
| ---------- | ---- | ------- |
| TypeScript | 2012 | Static  |
| Python     | 1991 | Dynamic |
| Rust       | 2010 | Static  |
| JavaScript | 1995 | Dynamic |
```

Renders as:

| Language   | Year | Typing  |
| ---------- | ---- | ------- |
| TypeScript | 2012 | Static  |
| Python     | 1991 | Dynamic |
| Rust       | 2010 | Static  |
| JavaScript | 1995 | Dynamic |

## Callouts

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

## Expandable

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

## Code Tabs

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

Add `sync="key"` to keep multiple code tab groups in sync across the page. Selecting a tab in one group updates all others with the same key:

````md
```js tab="JavaScript" sync="lang"
console.log("hello")
```

```python tab="Python" sync="lang"
print("hello")
```
````

## Content Tabs

Group arbitrary content into tabs using the `:::tab` directive. Consecutive tabs are automatically grouped.

Add a `sync` attribute to synchronize tab selection across multiple tab groups on the same page. When a user selects a tab in one group, all other groups with the same `sync` key switch to the matching tab. The selection is persisted in localStorage.

```md
:::tab{title="npm" sync="pm"}
npm install livemark
:::

:::tab{title="pnpm" sync="pm"}
pnpm add livemark
:::
```

Here is an example without sync:

```md
:::tab{title="React"}
React uses JSX for templating and hooks for state management.
:::

:::tab{title="Vue"}
Vue uses single-file components with template, script, and style sections.
:::
```

Renders as:

:::tab{title="React"}
React uses **JSX** for templating and hooks for state management.

```jsx
function App() {
  return <h1>Hello</h1>
}
```

:::

:::tab{title="Vue"}
Vue uses **single-file components** with template, script, and style sections.

```vue
<template>
  <h1>Hello</h1>
</template>
```

:::

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

:::card{title="Getting Started" href="/getting-started/" icon="rocket"}
Learn how to set up your first project.
:::

:::card{title="Configuration" href="/customization/configuration/" icon="layers"}
Configure your Livemark project.
:::

:::card{title="GitHub" href="https://github.com/datisthq/livemark" icon="github"}
View the source code on GitHub.
:::

:::card{title="Markdown" icon="file-code"}
This page documents all markdown features.
:::

## Badges

Inline status badges using the `:badge` directive:

```md
:badge[Beta] :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}
```

Renders as:

:badge[Beta] :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}

## Buttons

Call-to-action link buttons using the `::button` leaf directive:

```md
::button[Get Started]{href="/getting-started"}
```

With variant and size options:

```md
::button[Get Started]{href="/getting-started" variant="default" size="lg"}
::button[Configuration]{href="/configuration" variant="outline"}
::button[View Source]{href="/github" variant="secondary" size="sm"}
```

You can also use the `label` attribute:

```md
::button{href="/getting-started" label="Get Started"}
```

Renders as:

::button[Get Started]{href="/getting-started/" variant="default" size="lg"}
::button[Configuration]{href="/customization/configuration/" variant="outline"}
::button[View Source]{href="https://github.com/datisthq/livemark" variant="secondary" size="sm"}

Available variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`. Available sizes: `default`, `sm`, `lg`.

## Icons

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

## File Tree

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

## Columns

Arrange content side by side using consecutive `:::column` directives. They are automatically grouped into a grid:

```md
:::column
**Left column** with markdown content.
:::

:::column
**Right column** with more content.
:::
```

Renders as:

:::column
**Left column** with markdown content, including lists:

- Item one
- Item two

:::

:::column
**Right column** with more content:

> A blockquote works here too.

:::
