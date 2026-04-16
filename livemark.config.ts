import { defineConfig } from "./index.ts"

export default defineConfig({
  site: "https://livemark.dev",
  include: ["docs/**/*.md", "blog/**/*.md"],
  exclude: "docs/**/includes/**",
  sections: [
    { title: "Docs", pathname: "/" },
    { title: "Blog", pathname: "/blog/", type: "blog" },
  ],
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
