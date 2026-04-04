---
title: Getting Started
description: Learn how to set up your first Livemark project.
---

# Getting Started

Welcome to **Livemark**. This is a sample document that exercises the MDX pipeline.

## Installation

### Using pnpm

```bash
pnpm add livemark
```

### Using npm

```bash
npm install livemark
```

## Code Highlighting

```typescript
import { defineConfig } from "livemark"

export default defineConfig({
  docs: { folders: ["docs"] },
})
```

### Custom Themes

You can configure Shiki themes in your config:

```typescript
export default defineConfig({
  shiki: { themes: { light: "catppuccin-latte", dark: "catppuccin-mocha" } },
})
```

## GFM Features

| Feature       | Status    |
| ------------- | --------- |
| Tables        | Supported |
| Task lists    | Supported |
| Strikethrough | Supported |

- [x] Syntax highlighting
- [x] GitHub Flavored Markdown
- [ ] Mermaid diagrams

## Math

The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
