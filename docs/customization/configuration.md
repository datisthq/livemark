---
title: Configuration
description: How to configure your Livemark project.
icon: layers
order: 1
pathname: /customization/configuration/
image: ./images/cover.png
author: Livemark Team
date: 2026-04-01
---

# Configuration

Livemark is configured via a `livemark.config.ts` file in your project root.

## Basic Setup

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  articles: { include: "docs/**/*.mdx" },
})
```

## Include and Exclude

Use glob patterns to control which files are included:

```typescript
export default defineConfig({
  docs: {
    include: ["docs/**/*.mdx", "guides/**/*.mdx"],
    exclude: "docs/drafts/**",
  },
})
```

### Glob Syntax

Livemark uses standard glob patterns:

- `*` matches any file in the current directory
- `**` matches files in any subdirectory
- `{a,b}` matches either `a` or `b`

### Excluding Drafts

Prefix files with `_` or place them in a `drafts/` folder, then exclude them:

```typescript
export default defineConfig({
  docs: {
    include: "docs/**/*.md",
    exclude: ["docs/drafts/**", "docs/_*"],
  },
})
```

## Options

| Option    | Type                 | Description                     |
| --------- | -------------------- | ------------------------------- |
| `include` | `string \| string[]` | Glob patterns for content files |
| `exclude` | `string \| string[]` | Glob patterns to exclude        |
