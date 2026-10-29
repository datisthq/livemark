import { defineConfig } from "./source/index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  logo: "/logo.svg",
  title: "Livemark",
  description: {
    en: "Markdown site generator",
    es: "Generador de sitios Markdown",
    zh: "Markdown 站点生成器",
  },
  favicon: "/logo.png",
  include: ["docs/**/*.md", "blog/**/*.md", "CONTRIBUTING.md"],
  skills: "skills/*/SKILL.md",
  exclude: ["docs/**/includes/**"],
  languages: [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "zh", label: "简体中文" },
  ],
  sections: [
    {
      title: { en: "Docs", es: "Documentación", zh: "文档" },
      prefix: "/",
      icon: "book-open",
    },
    { title: "Blog", prefix: "/blog/", type: "blog", icon: "rss" },
    {
      title: { en: "Changelog", es: "Cambios", zh: "更新日志" },
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
      version: true,
      icon: "history",
    },
    {
      title: "GitHub",
      type: "custom",
      url: "https://github.com/datisthq/livemark",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "CONTRIBUTING.md",
      article: {
        title: "Contributing",
        description:
          "How to report bugs and share ideas, and how team members work on Livemark.",
        icon: "heart-handshake",
        path: "/contributing/",
        order: -1,
      },
    },
  ],
})
