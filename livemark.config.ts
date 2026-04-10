import { defineConfig } from "./index.ts"

export default defineConfig({
  url: "https://livemark.dev",
  articles: { include: "docs/**/*.md", exclude: "docs/**/includes/**" },
})
