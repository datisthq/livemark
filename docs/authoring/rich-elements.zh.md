---
title: 富元素
path: /authoring/rich-elements/
icon: layout-grid
order: 6
---

# 富元素

## 表格 {#tables}

标准 GFM 表格，支持按列排序：点击任意表头即可排序：

```md
| Language   | Year | Typing  |
| ---------- | ---- | ------- |
| TypeScript | 2012 | Static  |
| Python     | 1991 | Dynamic |
| Rust       | 2010 | Static  |
| JavaScript | 1995 | Dynamic |
```

渲染效果：

| 语言       | 年份 | 类型系统 |
| ---------- | ---- | -------- |
| TypeScript | 2012 | 静态     |
| Python     | 1991 | 动态     |
| Rust       | 2010 | 静态     |
| JavaScript | 1995 | 动态     |

## 提示框 {#callouts}

提示框用于突出显示重要信息。可用类型：note、tip、info、warning、danger。

GitHub 语法：

```md
> [!TIP]
> GitHub syntax also works.
```

指令语法：

```md
:::note
This is a note.
:::
```

自定义标题：

```md
:::warning[Breaking Change]
This API has been removed in v2.
:::
```

渲染效果：

:::note
这是一条注释。
:::

:::tip
这里是一条实用建议。
:::

:::warning
使用时请多加小心。
:::

:::danger
严重警告！
:::

:::info
补充信息。
:::

:::warning[破坏性变更]
该 API 已在 v2 中移除。
:::

## 可展开内容 {#expandable}

使用 `:::details` 指令创建可展开的内容：

```md
:::details[Click to expand]
Hidden content here with **markdown** support.
:::
```

渲染效果：

:::details[点击展开]
这里是隐藏的内容，支持 **Markdown**。
:::

其中可以嵌套任意 Markdown，包括代码块、列表和提示框：

:::details[配置示例]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/*.md",
})
```

:::

## 代码标签页 {#code-tabs}

使用 `tab="name"` meta 将连续的代码块分组为标签页：

````md
```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```
````

渲染效果：

```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```

添加 `sync="key"` 可让页面中的多个代码标签页组保持同步。在某一组中选择标签页时，所有使用相同 key 的其他组都会随之更新：

````md
```js tab="JavaScript" sync="lang"
console.log("hello")
```

```python tab="Python" sync="lang"
print("hello")
```
````

## 内容标签页 {#content-tabs}

使用 `:::tab` 指令将任意内容分组为标签页。连续的标签页会自动归为一组。

添加 `sync` 属性可在同一页面的多个标签页组之间同步选中状态。当用户在某一组中选择一个标签页时，所有使用相同 `sync` key 的其他组都会切换到对应的标签页。选中状态会保存在 localStorage 中。

```md
:::tab{title="npm" sync="pm"}
npm install livemark
:::

:::tab{title="pnpm" sync="pm"}
pnpm add livemark
:::
```

下面是一个不使用 sync 的示例：

```md
:::tab{title="React"}
React uses JSX for templating and hooks for state management.
:::

:::tab{title="Vue"}
Vue uses single-file components with template, script, and style sections.
:::
```

渲染效果：

:::tab{title="React"}
React 使用 **JSX** 编写模板，使用 hooks 管理状态。

```jsx
function App() {
  return <h1>Hello</h1>
}
```

:::

:::tab{title="Vue"}
Vue 使用包含 template、script 和 style 三个部分的**单文件组件**。

```vue
<template>
  <h1>Hello</h1>
</template>
```

:::

## 步骤 {#steps}

在标题后添加 `[step]`，即可创建带编号的分步指南：

```md
### Install Dependencies [step]

Run `npm install` to add all required packages.

### Configure Project [step]

Create a config file in the project root.

### Deploy [step]

Push to production.
```

渲染效果：

### 安装依赖 {#install-dependencies} [step]

运行 `npm install` 安装所有必需的包。

### 配置项目 {#configure-project} [step]

在项目根目录中创建配置文件。

### 部署 {#deploy} [step]

发布到生产环境。

## 卡片 {#cards}

使用 `:::card` 指令创建内容卡片。连续的卡片会自动排列成网格。

```md
:::card{title="Getting Started" href="/introduction" icon="rocket"}
Learn how to set up your first project.
:::
```

```md
:::card{title="Configuration" href="/configuration" icon="layers"}
Configure your Livemark project.
:::
```

渲染效果：

:::card{title="快速上手" href="/zh/introduction/" icon="rocket"}
了解如何搭建你的第一个项目。
:::

:::card{title="配置" href="/zh/customization/config-file/" icon="layers"}
配置你的 Livemark 项目。
:::

:::card{title="GitHub" href="https://github.com/datisthq/livemark" icon="github"}
在 GitHub 上查看源代码。
:::

:::card{title="Markdown" icon="file-code"}
本页介绍了所有 Markdown 功能。
:::

## 徽章 {#badges}

使用 `:badge` 指令添加行内状态徽章：

```md
:badge[Beta] :badge[Stable]{variant="positive"} :badge[Experimental]{variant="warning"} :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}
```

渲染效果：

:badge[Beta] :badge[稳定]{variant="positive"} :badge[实验性]{variant="warning"} :badge[已弃用]{variant="destructive"} :badge[新]{variant="secondary"}

可用的变体：`default`、`secondary`、`positive`、`warning`、`destructive`、`outline`、`ghost`、`link`。

## 按钮 {#buttons}

使用 `::button` 叶子指令创建行动号召链接按钮：

```md
::button[Get Started]{href="/introduction"}
```

带变体和尺寸选项：

```md
::button[Get Started]{href="/introduction" variant="default" size="lg"}
::button[Configuration]{href="/configuration" variant="outline"}
::button[View Source]{href="/github" variant="secondary" size="sm"}
```

也可以使用 `label` 属性：

```md
::button{href="/introduction" label="Get Started"}
```

渲染效果：

::button[开始使用]{href="/zh/introduction/" variant="default" size="lg"}
::button[配置]{href="/zh/customization/config-file/" variant="outline"}
::button[查看源代码]{href="https://github.com/datisthq/livemark" variant="secondary" size="sm"}

可用的变体：`default`、`outline`、`secondary`、`ghost`、`positive`、`warning`、`destructive`、`link`。可用的尺寸：`default`、`sm`、`lg`。

## 图标 {#icons}

使用 `:icon` 指令插入来自 Lucide 图标库的行内图标：

```md
:icon{name="rocket"} Launch :icon{name="check"} Done :icon{name="heart"} Love
```

渲染效果：

:icon{name="rocket"} 发布 :icon{name="check"} 完成 :icon{name="heart"} 喜爱

使用 Tailwind 颜色：

```md
:icon{name="check" className="text-positive"} Pass :icon{name="x" className="text-destructive"} Fail :icon{name="star" className="text-warning"} Star
```

渲染效果：

:icon{name="check" className="text-positive"} 通过 :icon{name="x" className="text-destructive"} 失败 :icon{name="star" className="text-warning"} 星标

## 文件树 {#file-tree}

使用 `:::filetree` 指令展示文件和目录结构。目录以末尾的 `/` 表示：

```md
:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json
:::
```

渲染效果：

:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json

:::

## 分栏 {#columns}

使用连续的 `:::column` 指令将内容并排排列。它们会自动排列成网格：

```md
:::column
**Left column** with markdown content.
:::

:::column
**Right column** with more content.
:::
```

渲染效果：

:::column
**左栏**包含 Markdown 内容，包括列表：

- 第一项
- 第二项

:::

:::column
**右栏**包含更多内容：

> 这里同样可以使用引用块。

:::
