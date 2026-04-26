import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "./actions/config/load.ts"
import { livemark } from "./plugins/vite-livemark.ts"

const config = await loadConfig()

export default defineConfig({
  plugins: [
    livemark({ config }),
    devtools(),
    tailwind(),
    contentCollections({ configPath: "content-collections.ts" }),
    tanstackStart({
      srcDirectory: ".",
      pages: [{ path: "/" }],
      prerender: { enabled: true, crawlLinks: true },
      sitemap: config.site
        ? { enabled: true, host: config.site }
        : { enabled: false },
      router: { generatedRouteTree: "routeTree.gen.ts" },
    }),
    react(),
    svgr(),
  ],
})
