---
title: 语法主题
description: 为围栏代码块选择浅色和深色主题。
path: /customization/syntax-themes/
icon: palette
order: 6
---

# 语法主题

Livemark 使用 [Shiki](https://shiki.style) 为围栏代码块提供语法高亮。每个主题都有两种风格：在浅色背景下启用的浅色主题，以及在深色背景下启用的深色主题。系统会根据访问者的主题偏好自动选择合适的一种。

## 配置 [#configuration]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  codeThemeLight: "github-light",
  codeThemeDark: "github-dark",
})
```

| 字段             | 类型         | 默认值               |
| ---------------- | ------------ | -------------------- |
| `codeThemeLight` | `ShikiTheme` | `"catppuccin-latte"` |
| `codeThemeDark`  | `ShikiTheme` | `"catppuccin-mocha"` |

任何 [Shiki 内置主题名](https://shiki.style/themes) 都可以使用。

## 常用搭配 [#popular-pairings]

- `github-light` / `github-dark`
- `catppuccin-latte` / `catppuccin-mocha`（默认）
- `min-light` / `min-dark`
- `vitesse-light` / `vitesse-dark`
- `one-light` / `one-dark-pro`

## 关于无障碍 [#a-note-on-accessibility]

Livemark 默认对 `catppuccin-latte` 做了一处细微的颜色修正：该主题默认的字符串绿色（`#40a02b`）在其背景上的对比度为 3.2:1，低于 WCAG AA 标准（4.5:1）。Livemark 会在构建时将其替换为 `#2a7e16`。

如果你使用自己的主题并希望符合 AA 标准，请在发布前用对比度工具检查每个 token 颜色与代码块背景的对比度。正常字号文本需要达到的阈值是 4.5:1。

## 另请参阅 [#see-also]

- [代码块](/zh/authoring/code-blocks/)：编写方面的内容，包括 meta 字符串、diff、行高亮。
- [覆盖（escape）](/zh/customization/overriding-escaping/)：如需更深入的控制，可覆盖整个代码块组件。
