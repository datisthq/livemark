import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  include: "docs/**/*.md",
  exclude: "docs/**/includes/**",
  sidebarLinks: [
    { url: "https://datist.io/", title: "Datist", icon: "heart-handshake" },
  ],
})
