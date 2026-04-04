---
title: Components
description: Built-in components available in your MDX content.
---

# Components

Livemark provides a set of built-in components you can use in your MDX files.

## Section

Wraps content in an animated section with fade-in on scroll:

```tsx
<Section>
  <Content>Your content here</Content>
</Section>
```

## Content

Centers content with a max-width container:

```tsx
<Content>
  <h1>Centered heading</h1>
  <p>Centered paragraph with responsive padding.</p>
</Content>
```

## Code Blocks

Fenced code blocks are automatically syntax-highlighted with Shiki.

### Syntax Highlighting

Languages are detected automatically from the info string:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

```rust
fn main() {
    println!("Hello from Livemark!");
}
```

### Line Highlighting

Highlight specific lines by adding line numbers in curly braces after the language:

```typescript {2,4-6}
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

## Callouts

Callouts highlight important information with a colored banner and icon. Livemark supports two syntaxes.

### Directive Syntax

Use triple-colon fenced containers with one of the supported types:

:::note
This is a **note** callout. Use it for general information the reader should be aware of.
:::

:::tip
This is a **tip** callout. Use it for helpful suggestions and best practices.
:::

:::info
This is an **info** callout. Use it for supplementary context or references.
:::

:::warning
This is a **warning** callout. Use it for potential pitfalls or things to watch out for.
:::

:::danger
This is a **danger** callout. Use it for destructive actions or critical issues.
:::

You can also provide a custom title:

:::tip[Pro Tip]
Custom titles override the default type label.
:::

### GitHub Syntax

Standard GitHub-flavored Markdown callout syntax is also supported:

> [!NOTE]
> This is a GitHub-style note callout.

> [!TIP]
> This is a GitHub-style tip callout.

> [!IMPORTANT]
> This is a GitHub-style important callout (renders as info).

> [!WARNING]
> This is a GitHub-style warning callout.

> [!CAUTION]
> This is a GitHub-style caution callout (renders as danger).
