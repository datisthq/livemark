---
title: Configuration
description: How to configure your Livemark project.
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

## Options

| Option    | Type                 | Description                     |
| --------- | -------------------- | ------------------------------- |
| `include` | `string \| string[]` | Glob patterns for content files |
| `exclude` | `string \| string[]` | Glob patterns to exclude        |
