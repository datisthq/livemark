---
title: Code Blocks
icon: code
order: 7
path: /markdown/code-blocks/
---

# Code Blocks

Fenced code blocks are syntax-highlighted with Shiki using catppuccin themes. Each code block includes a word wrap toggle button that switches between horizontal scrolling and wrapped lines.

## Titles

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

## Line Highlighting

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

## Word Highlighting

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

## Line Numbers

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

## Diff Lines

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

## Focus Lines

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

## Error and Warning

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

## Collapsible Code

Limit the visible height of long code blocks with `maxLines=N`. An "Expand" button reveals the full code:

````md
```typescript maxLines=3
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```
````

Renders as:

```typescript maxLines=3
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

## Language Icons

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

## TypeScript Support

Add `twoslash` to a TypeScript code block to enable inline type information. Hover over highlighted identifiers to see their types:

````md
```typescript twoslash
const greeting = "hello"
//    ^?
```
````

Renders as:

```typescript twoslash
const greeting = "hello"
//    ^?
```

Use `// @errors: 2304` to showcase expected errors:

```typescript twoslash
// @errors: 2304
const x = unknown_var
```

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
