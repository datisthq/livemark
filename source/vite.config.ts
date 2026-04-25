import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import {
  physical,
  rootRoute,
  route,
  type VirtualRouteNode,
} from "@tanstack/virtual-file-routes"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "./actions/config/load.ts"
import { WebsiteConfig } from "./models/config.ts"
import { OVERRIDE_SUBDIRS } from "./settings.ts"
import { livemark } from "./plugins/vite-livemark.ts"

const config = await loadConfig()
const websiteDir = import.meta.dirname
const websiteRelative = relative(config.root, websiteDir)
const overridesRoot = join(config.root, ".livemark")

// Seed `.livemark/.gitignore` on first run so Vite's build/cache artifacts
// never get committed by accident.
const gitignorePath = join(overridesRoot, ".gitignore")
if (!existsSync(gitignorePath)) {
  mkdirSync(overridesRoot, { recursive: true })
  writeFileSync(gitignorePath, "/build\n/cache\n")
}

const routeChildren: VirtualRouteNode[] = [route("/$", "$.tsx")]
if (existsSync(join(overridesRoot, "routes"))) {
  routeChildren.push(physical("../../.livemark/routes"))
}

export default defineConfig({
  root: config.root,
  publicDir: join(config.root, ".livemark", "public"),
  build: { outDir: ".livemark/build" },
  define: {
    "import.meta.env.CONFIG": JSON.stringify(WebsiteConfig.parse(config)),
  },
  plugins: [
    livemark({
      defaultsRoot: websiteDir,
      overridesRoot,
      subdirs: [...OVERRIDE_SUBDIRS],
      configPath: config.configPath,
    }),
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
        virtualRouteConfig: rootRoute("__root.tsx", routeChildren),
      },
    }),
    react(),
    svgr(),
  ],
})
