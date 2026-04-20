import { mkdirSync } from "node:fs"
import { join, relative } from "node:path"
import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { physical, rootRoute, route } from "@tanstack/virtual-file-routes"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "../actions/config/load.ts"
import { WebsiteConfig } from "../models/config.ts"

const config = await loadConfig()
const websiteDir = import.meta.dirname
const websiteRelative = relative(config.root, websiteDir)

// Ensure user-authored virtual routes directory exists so the router-generator
// can scan it without ENOENT when a project has no custom routes yet.
const virtualRoutesDir = join(config.root, ".livemark", "routes")
mkdirSync(virtualRoutesDir, { recursive: true })

export default defineConfig({
  root: config.root,
  publicDir: join(config.root, ".livemark", "public"),
  build: { outDir: ".livemark/build" },
  define: {
    "import.meta.env.CONFIG": JSON.stringify(WebsiteConfig.parse(config)),
  },
  plugins: [
    devtools(),
    tailwind(),
    contentCollections({
      configPath: join(websiteRelative, "content-collections.ts"),
    }),
    tanstackStart({
      srcDirectory: websiteRelative,
      pages: [{ path: "/" }],
      prerender: { enabled: true, crawlLinks: true },
      sitemap: config.site
        ? { enabled: true, host: config.site }
        : { enabled: false },
      router: {
        virtualRouteConfig: rootRoute("__root.tsx", [
          route("/$", "$.tsx"),
          physical("../../.livemark/routes"),
        ]),
      },
    }),
    react(),
    svgr(),
  ],
})
