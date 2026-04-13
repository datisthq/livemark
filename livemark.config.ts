import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  articles: { include: "docs/**/*.md", exclude: "docs/**/includes/**" },
})
