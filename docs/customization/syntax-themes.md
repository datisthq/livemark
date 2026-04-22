---
title: Syntax Themes
description: Pick light and dark themes for fenced code blocks.
icon: palette
order: 3
path: /customization/syntax-themes/
---

# Syntax Themes

Livemark uses [Shiki](https://shiki.style) to highlight fenced code blocks. Each theme renders in two flavours: a light theme that activates on light backgrounds and a dark theme that activates on dark backgrounds. The correct one is chosen automatically based on the visitor's theme preference.

## Configuration

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  codeThemeLight: "github-light",
  codeThemeDark: "github-dark",
})
```

| Field            | Type         | Default              |
| ---------------- | ------------ | -------------------- |
| `codeThemeLight` | `ShikiTheme` | `"catppuccin-latte"` |
| `codeThemeDark`  | `ShikiTheme` | `"catppuccin-mocha"` |

Any [built-in Shiki theme name](https://shiki.style/themes) works.

## Popular pairings

- `github-light` / `github-dark`
- `catppuccin-latte` / `catppuccin-mocha` (default)
- `min-light` / `min-dark`
- `vitesse-light` / `vitesse-dark`
- `one-light` / `one-dark-pro`

## A note on accessibility

Livemark applies a tiny color fix-up to `catppuccin-latte` out of the box: the theme's default string green (`#40a02b`) sits at a 3.2:1 contrast ratio on its background, below WCAG AA (4.5:1). Livemark remaps it to `#2a7e16` at build time.

If you bring your own theme and want to stay AA-compliant, check each token colour against its code-block background with a contrast tool before shipping. The threshold you need for normal-size text is 4.5:1.

## See also

- [Code Blocks](/markdown/code-blocks/) — the authoring side: meta strings, diffs, line highlights.
- [File Overrides](/customization/file-overrides/) — override the full code-block component if you need deeper control.
