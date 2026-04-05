import { join, relative } from "node:path"
import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "../actions/config/load.ts"

const config = await loadConfig()
const websiteDir = import.meta.dirname
const websiteRelative = relative(config.root, websiteDir)

export default defineConfig({
  root: config.root,
  publicDir: join(websiteDir, "public"),
  build: { outDir: ".livemark/build" },
  define: {
    "import.meta.env.SITE_TITLE": JSON.stringify(config.title),
    "import.meta.env.SITE_DESCRIPTION": JSON.stringify(config.description),
  },
  plugins: [
    devtools(),
    tailwind(),
    contentCollections({
      configPath: join(websiteRelative, "content-collections.ts"),
    }),
    tanstackStart({
      srcDirectory: websiteRelative,
      prerender: { enabled: true, crawlLinks: true },
      // TODO: provide host?
      sitemap: { enabled: true },
    }),
    react(),
    svgr(),
  ],
})
