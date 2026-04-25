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

// Seed `.livemark/.gitignore` on first run so Vite's build/cache
// artifacts never get committed by accident. On the same first-run
// trigger, also seed an `.npmrc` when pnpm is in use: pnpm's strict
// isolation hides livemark's transitive deps (react, @tanstack/*) from
// Vite's optimizer, which walks from config.root rather than livemark's
// subtree. The public-hoist-pattern entries make those deps reachable
// from the consumer's top-level node_modules. Skip when the consumer
// already authored their own `.npmrc` — never overwrite user config.
const gitignorePath = join(overridesRoot, ".gitignore")
if (!existsSync(gitignorePath)) {
  mkdirSync(overridesRoot, { recursive: true })
  writeFileSync(gitignorePath, "/build\n/cache\n")

  const npmrcPath = join(config.root, ".npmrc")
  const usingPnpm = existsSync(join(config.root, "pnpm-lock.yaml"))
  if (usingPnpm && !existsSync(npmrcPath)) {
    writeFileSync(
      npmrcPath,
      "public-hoist-pattern[]=react\n" +
        "public-hoist-pattern[]=react-*\n" +
        "public-hoist-pattern[]=@tanstack/*\n",
    )
    console.log(
      "Created .npmrc with hoist patterns for pnpm. Run `pnpm install` to apply.",
    )
  }
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
  // peerDependencies guarantee one canonical react/react-dom in the pnpm
  // store. dedupe collapses any transitive resolutions to that copy.
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
