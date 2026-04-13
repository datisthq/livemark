import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  include: "docs/**/*.md",
  exclude: "docs/**/includes/**",
})
