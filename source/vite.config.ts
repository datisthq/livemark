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
const sourceDir = import.meta.dirname
const sourceRelative = relative(config.root, sourceDir)
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
  // physical(dir) resolves `dir` relative to the routes directory
  // (`srcDirectory/routes`). A hardcoded "../../.livemark/routes" only
  // works when source/ sits one level under config.root — it lands at
  // node_modules/.livemark/routes once livemark is installed. Compute
  // the path dynamically from the consumer's actual layout.
  const routesDir = join(sourceDir, "routes")
  routeChildren.push(
    physical(relative(routesDir, join(overridesRoot, "routes"))),
  )
}

export default defineConfig({
  root: config.root,
  publicDir: join(config.root, ".livemark", "public"),
  build: { outDir: ".livemark/build" },
  define: {
    "import.meta.env.CONFIG": JSON.stringify(WebsiteConfig.parse(config)),
  },
  // dedupe: collapse multiple resolutions of the same React-family package
  // to a single physical module, so livemark's source, the consumer's
  // .livemark/ overrides, and any transitive package that re-resolves React
  // through its own peer-dep chain all share one instance. Without this,
  // pnpm's isolated layout can land different importers on different copies
  // of React, breaking single-instance invariants (useSyncExternalStore
  // returns null, hooks see wrong stores).
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    livemark({
      defaultsRoot: sourceDir,
      overridesRoot,
      subdirs: [...OVERRIDE_SUBDIRS],
      configPath: config.configPath,
    }),
    devtools(),
    tailwind(),
    contentCollections({
      configPath: join(sourceRelative, "content-collections.ts"),
    }),
    tanstackStart({
      srcDirectory: sourceRelative,
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
