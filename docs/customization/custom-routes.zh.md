---
title: 自定义路由
description: 在 .livemark/routes/ 中编写新页面，与 Markdown 内容并存。
path: /customization/custom-routes/
icon: route
order: 7
---

# 自定义路由

Livemark 基于 [TanStack Router](https://tanstack.com/router) 构建。你放入 `.livemark/routes/` 的任何 `.tsx` 文件都会成为对应 URL 上的页面，无需注册，也无需修改配置。

## 最小示例 [#minimal-example]

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "livemark/components/Layout"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16 prose">
        <h1>About</h1>
        <p>Anything you'd write in a normal React page, here.</p>
      </div>
    </Layout>
  )
}
```

保存后访问 `/about/`。`Layout` 为页面提供与文章相同的外框：横幅、顶栏、导航和深色模式切换按钮。

## 选择页面外框 [#choosing-the-chrome]

自定义路由一开始是**空白**的：在你添加之前，它周围什么都不会绘制。按页面需要组合即可：

| 你渲染的内容                | 你得到的效果                         |
| --------------------------- | ------------------------------------ |
| `<Layout>`                  | 横幅、顶栏、手机端导航面板、返回顶部 |
| `<Layout withSidebar>`      | 以上内容，外加文章侧边栏             |
| `<Banner />` + `<Header />` | 仅横幅和顶栏；在手机上是一个栏目菜单 |
| 什么都不渲染                | 一个空白页面，完全由你掌控           |

首页通常只需要顶栏：

```tsx title=".livemark/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main>{/* your hero */}</main>
    </>
  )
}
```

## 与站点其余部分的关系 [#how-it-fits-with-the-rest-of-the-site]

- **精确路径优先。** 自定义路由的优先级高于提供 Markdown 文章的兜底路由。如果你创建了 `/about`，那么位于同一路径的 `docs/about.md` 文章将无法访问。
- **根路径 `/`。** 放入 `.livemark/routes/index.tsx`，即可用你自己的页面替换默认首页。Livemark 的默认站点使用 Markdown 首页，覆盖它可以让你用 React 完全掌控首屏区域。
- **嵌套路径。** 文件路径与 URL 路径一一对应：`.livemark/routes/guide/quickstart.tsx` ⇒ `/guide/quickstart/`。
- **head 标签随之提供。** 自定义路由会获得站点标题和描述、规范链接和 `og:url`（设置了 `site` 时），在多语言站点上还会获得 `og:locale` 和 `hreflang` 链接，所用语言取决于其路径所属的语言。路由上的 `head` 可以覆盖标题和 meta 标签。

## 导入 Livemark 基础组件 [#importing-livemark-primitives]

通过 `livemark/*` 子路径导出，复用 Livemark 内部使用的相同组件：

```tsx title=".livemark/routes/about.tsx"
import { Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "livemark/elements/button"
import { cn } from "cn"

export const Route = createFileRoute("/about")({ component: About })

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <Link to="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
        ← Back home
      </Link>
    </main>
  )
}
```

## 静态资源 [#static-assets]

放在 `.livemark/public/` 中的文件会在站点根路径下提供。可以把 `robots.txt`、自定义的 `favicon.svg` 或 `/og-image.png` 放在这里。

## 另请参阅 [#see-also]

- [覆盖（escape）](/zh/customization/overriding-escaping/)：替换内置页面或组件，而不是新增一个。
- [站点元数据](/zh/customization/site-metadata/)：站点标题和 favicon，同样会显示在自定义路由上。
