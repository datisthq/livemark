---
title: 代码块
path: /authoring/code-blocks/
icon: code
order: 7
---

# 代码块

围栏代码块使用 Shiki 和 catppuccin 主题进行语法高亮。每个代码块都带有一个自动换行切换按钮，可在横向滚动和自动换行之间切换。未指定语言或使用 Shiki 无法识别的语言的代码块，会以相同样式渲染为纯文本。

## 标题 [#titles]

为代码块添加文件名或标题：

````md
```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"
```
````

渲染效果：

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  articles: { include: "docs/*.md" },
})
```

## 行高亮 [#line-highlighting]

在 meta 字符串中使用 `{line,range}` 语法，或在代码块内使用 `// [!code highlight]` 注释，来高亮指定的行。

使用 meta 语法：

````md
```typescript {2,4-6}
const a = 1
const b = 2
```
````

渲染效果：

```typescript {2,4-6}
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

使用注释语法（`// [!code highlight]`）：

````md
```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```
````

渲染效果：

```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```

注释形式的注解会从渲染结果中移除。同样支持块注释语法 `/* [!code highlight] */`。

## 单词高亮 [#word-highlighting]

使用 `{word:TERM}` 语法高亮某个单词的所有出现位置：

````md
```typescript {word:config}
const config = loadConfig()
export default config
```
````

渲染效果：

```typescript {word:config}
const config = loadConfig()
export default config
```

## 行号 [#line-numbers]

使用 `lineNumbers` 在代码旁显示行号：

````md
```typescript lineNumbers
const a = 1
const b = 2
```
````

渲染效果：

```typescript lineNumbers
const a = 1
const b = 2
const c = 3
```

使用 `lineNumbers=N` 从指定行开始编号：

````md
```typescript lineNumbers=5
const a = 1
const b = 2
```
````

渲染效果：

```typescript lineNumbers=5
const a = 1
const b = 2
const c = 3
```

## Diff 行 [#diff-lines]

使用 `// [!code ++]` 和 `// [!code --]` 将行标记为新增或删除：

````md
```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```
````

渲染效果：

```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```

## 聚焦行 [#focus-lines]

使用 `// [!code focus]` 淡化除聚焦行以外的所有行：

````md
```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```
````

渲染效果：

```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```

## 错误与警告 [#error-and-warning]

使用 `// [!code error]` 和 `// [!code warning]` 将行标记为错误或警告：

````md
```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```
````

渲染效果：

```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```

## 可折叠代码 [#collapsible-code]

使用 `maxLines=N` 限制长代码块的可见高度。点击「Expand」按钮即可显示完整代码：

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

渲染效果：

```typescript maxLines=3
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

## 语言图标 [#language-icons]

当代码块带有标题时，会自动在标题栏中显示语言图标。支持的语言包括 TypeScript、JavaScript、React、Python、Rust 和 shell。

```typescript title="example.ts"
const greeting = "hello"
```

```python title="example.py"
greeting = "hello"
```

```rust title="example.rs"
let greeting = "hello";
```

## TypeScript 支持 [#typescript-support]

为 TypeScript 代码块添加 `twoslash` 即可启用行内类型信息。将鼠标悬停在高亮的标识符上即可查看其类型：

````md
```typescript twoslash
const greeting = "hello"
//    ^?
```
````

渲染效果：

```typescript twoslash
const greeting = "hello"
//    ^?
```

使用 `// @errors: 2304` 展示预期的错误：

```typescript twoslash
// @errors: 2304
const x = unknown_var
```

## NPM 命令 [#npm-commands]

编写 npm 命令，即可自动生成适用于所有包管理器的标签页：

````md
```npm
npm install livemark
```
````

渲染效果：

```npm
npm install livemark
```
