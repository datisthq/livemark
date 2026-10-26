---
description: 将同名文件放入 .livemark/，即可覆盖任意 Livemark 组件、基础元素或样式表。
label: 覆盖
icon: file-pen-line
order: 10
path: /customization/overriding-escaping/
---

# 通过 escape 覆盖组件

Livemark 附带一套 React 组件库、shadcn 风格的基础元素和一份基础样式表。每个文件都可以通过在 `.livemark/` 下放置同名文件来覆盖：

| 要覆盖的文件                    | 放置文件的位置                    |
| ------------------------------- | --------------------------------- |
| `website/components/<Name>.tsx` | `.livemark/components/<Name>.tsx` |
| `website/elements/<name>.tsx`   | `.livemark/elements/<name>.tsx`   |
| `website/styles/<name>.css`     | `.livemark/styles/<name>.css`     |
| `website/head.ts`               | `.livemark/head.ts`               |

无需修改任何 import。Livemark 的其余部分会自动使用被覆盖的文件。

## `livemark escape` 命令 [#the-livemark-escape-command]

查找并复制要覆盖的默认文件这一步已经自动化：

```bash
# Pick files from a searchable list:
livemark escape

# Print every overridable file:
livemark escape --list

# Copy specific defaults into .livemark/:
livemark escape components/Footer.tsx elements/button.tsx
```

在终端中，`livemark escape` 会打开一个选择器：输入文字进行筛选，按 <kbd>Tab</kbd> 选择，按 <kbd>Enter</kbd> 复制。已经覆盖的文件会显示出来，但无法选中。在终端之外（管道、CI）运行时，它会像 `--list` 一样打印列表。

`livemark escape` 不会覆盖已存在的文件。如果想从头开始，请先删除你的覆盖文件。

删除覆盖文件即可恢复默认文件：开发服务器运行时会立即生效，否则在下一次 `start` 或 `build` 时生效。

## 示例：自定义页脚 [#example-custom-footer]

```bash
livemark escape components/Footer.tsx
```

然后编辑 `.livemark/components/Footer.tsx`：

```tsx title=".livemark/components/Footer.tsx"
export function Footer() {
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      Built by my team · 2026
    </p>
  )
}
```

保存后，开发服务器会立即应用它。

## 示例：重新设计按钮样式 [#example-retheme-buttons]

```bash
livemark escape elements/button.tsx
```

编辑 `.livemark/elements/button.tsx` 中 `cva` 的类名列表，即可全局修改按钮样式。由于 Livemark 自带的每个组件都通过覆盖机制导入 `Button`，你的变体会在所有地方生效。

## 示例：调整设计令牌 [#example-tweak-a-token]

```bash
livemark escape styles/general.css
```

编辑 `.livemark/styles/general.css` 中的 `:root` 块来更换品牌风格：

```css
:root {
  --primary: oklch(0.55 0.24 27); /* red */
}
```

## 在覆盖文件中导入其他 Livemark 模块 [#importing-other-livemark-modules-from-an-override]

在覆盖文件中，可以通过 `livemark/<subdir>/*` 子路径导出导入其他 Livemark 模块：

```tsx title=".livemark/components/Footer.tsx"
import { cn } from "cn"
import { Button } from "livemark/elements/button"
```

这些路径在构建时解析，并经过同样的覆盖查找：如果你也覆盖了 `button`，那么这里同样会使用你的版本。

### 覆盖文件的类型检查 [#type-checking-overrides]

Livemark 的模块以 TypeScript 源码形式发布，因此你的类型检查也会覆盖到它们，包括它们读取站点配置所用的 `livemark:virtual` 模块。它的类型随 `livemark` 包一起加载：任何包含 `livemark.config.ts` 的程序都已经具备这些类型。不包含它的程序只需在一个 `.d.ts` 文件中加一行：

```ts title=".livemark/env.d.ts"
/// <reference types="livemark/env" />
```

不要自己声明 `livemark:virtual`：手写的声明会与真实的配置类型逐渐脱节。

## 无法以这种方式覆盖的内容 [#what-you-cant-override-this-way]

- **自定义路由**：请改用 [`.livemark/routes/`](/zh/customization/custom-routes/)。
- **服务端代码**（`actions/`、`commands/`）：无法覆盖；如需修改，请 fork 仓库。
- **配置 schema**：`livemark.config.ts` 的结构是固定的。

## 另请参阅 [#see-also]

- [语法主题](/zh/customization/syntax-themes/)：如果只想更改代码的配色，这是更轻量的选项。
- [自定义路由](/zh/customization/custom-routes/)：编写新页面（而不是替换现有页面）。
