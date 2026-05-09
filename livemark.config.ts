import { defineConfig } from "./source/index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  logo: "/logo.svg",
  favicon: "/logo.png",
  include: ["docs/**/*.md", "blog/**/*.md", "README.md", "CONTRIBUTING.md"],
  exclude: ["docs/**/includes/**"],
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "https://github.com/datisthq/livemark",
      version: true,
    },
  ],
  links: [
    {
      url: "https://github.com/datisthq/livemark",
      title: "GitHub",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Introduction",
        description: "Learn how to set up your first Livemark project.",
        icon: "rocket",
        path: "/introduction/",
        order: 1,
      },
    },
    {
      file: "CONTRIBUTING.md",
      article: {
        title: "Contributing",
        description:
          "How to set up Livemark locally, propose changes, and ship a release.",
        icon: "heart-handshake",
        path: "/contributing/",
        order: -1,
      },
    },
  ],
})
