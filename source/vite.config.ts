import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "./actions/config/load.ts"
import { livemark } from "./plugins/vite-livemark.ts"
import { robots } from "./plugins/vite-robots.ts"

const config = await loadConfig()

export default defineConfig({
  plugins: [
    livemark({ config }),
    robots({ config }),
    devtools(),
    tailwind(),
    contentCollections({ configPath: "content-collections.ts" }),
    tanstackStart({
      srcDirectory: ".",
      // Seed path must match what the crawler produces (router-emitted
      // hrefs include the basepath), otherwise prerender records both
      // shapes and the sitemap ends up with duplicate entries.
      pages: [{ path: config.base ? `${config.base}/` : "/" }],
      // Disable route-tree auto-discovery: it produces basepath-naive
      // paths (e.g. `/`) that duplicate the crawl-derived prefixed paths,
      // bloating pages.json and sitemap. Crawling from the seed already
      // reaches every linked page.
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: false,
      },
      sitemap: config.site
        ? { enabled: true, host: config.site }
        : { enabled: false },
      router: {
        generatedRouteTree: "routeTree.gen.ts",
        basepath: config.base,
      },
    }),
    react(),
    svgr(),
  ],
})
