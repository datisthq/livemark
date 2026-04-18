import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  include: ["docs/**/*.md", "blog/**/*.md"],
  exclude: "docs/**/includes/**",
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
    },
  ],
  links: [
    {
      url: "https://github.com/datisthq/livemark",
      title: "GitHub",
      icon: "github",
    },
  ],
})
