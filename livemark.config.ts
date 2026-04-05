import { defineConfig } from "./index.ts"

export default defineConfig({
  articles: { include: "docs/**/*.md", exclude: "docs/includes/**" },
})
