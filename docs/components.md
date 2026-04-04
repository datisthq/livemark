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
