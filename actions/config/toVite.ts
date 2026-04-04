import { join, relative } from "node:path"
import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import type { InlineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import type { Config } from "../../models/config.ts"

const websiteDir = join(import.meta.dirname, "..", "..", "website")

/**
 * Create a Vite config from a resolved Livemark config.
 */
export function toViteConfig(config: Config): InlineConfig {
  const websiteRelative = relative(config.root, websiteDir)

  return {
    configFile: false,
    root: config.root,
    build: { outDir: join(websiteRelative, "build") },
    plugins: [
      devtools(),
      tailwind(),
      contentCollections({
        configPath: join(websiteRelative, "content-collections.ts"),
      }),
      tanstackStart({
        srcDirectory: websiteRelative,
        prerender: { enabled: true, crawlLinks: true },
      }),
      react(),
      svgr(),
    ],
  }
}
