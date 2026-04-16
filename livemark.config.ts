import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  include: "docs/**/*.md",
  exclude: "docs/**/includes/**",
  sections: [{ title: "Docs", pathname: "/" }],
  headerLinks: [
    {
      url: "https://github.com/datisthq/livemark",
      title: "GitHub",
      icon: "github",
    },
  ],
  sidebarLinks: [
    { url: "https://datist.io", title: "Datist", icon: "heart-handshake" },
  ],
})
