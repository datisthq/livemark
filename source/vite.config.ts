import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { join } from "node:path"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import { loadConfig } from "./actions/config/load.ts"
import { agents } from "./plugins/vite-agents.ts"
import { content } from "./plugins/vite-content.ts"
import { livemark } from "./plugins/vite-livemark.ts"
import { robots } from "./plugins/vite-robots.ts"
import { createArticleStore } from "./helpers/article-store.ts"
import { listRoutePages } from "./helpers/route-pages.ts"
import { buildSites } from "./helpers/site.ts"

const config = await loadConfig()
const sites = buildSites(config)
const store = createArticleStore(config)

// Per-blog-section RSS feed paths to prerender. Gated on `config.site`
// because feed URLs are absolute (matching the sitemap/robots.txt gate)
// and the route returns 404 without it anyway. Excluded from the sitemap
// since `.xml` payloads don't belong in a sitemap.
const blogFeedPages = config.site
  ? sites
      .flatMap(site => site.config.sections ?? [])
      .filter(s => s.type === "blog")
      .map(s => ({
        path: `${config.base ?? ""}${s.prefix}rss.xml`,
        sitemap: { exclude: true },
      }))
  : []

// The crawl never reaches a custom route nothing links to, so seed the project's
// static ones; this file runs from the package, not the mount.
const languagePages = sites.map(site => `${config.base ?? ""}${site.language.prefix}`)
const routePages = listRoutePages(join(config.root, ".livemark", "routes"))
  .map(path => `${config.base ?? ""}${path}`)
  .filter(path => !languagePages.includes(path))

export default defineConfig({
  plugins: [
    livemark({ config }),
    robots({ config }),
    agents({ config, store }),
    // Its server-to-browser console piping and Vite's browser-to-server forwarding echo
    // any browser error back and forth forever.
    devtools({ consolePiping: { enabled: false } }),
    tailwind(),
    content({ store, contentDir: config.root }),
    tanstackStart({
      srcDirectory: ".",
      // Seed path must match what the crawler produces (router-emitted
      // hrefs include the basepath), otherwise prerender records both
      // shapes and the sitemap ends up with duplicate entries.
      // One seed per language: a language is reachable only through the picker's
      // links, which the crawler would otherwise meet only on hydrated pages.
      pages: [
        ...languagePages.map(path => ({ path })),
        ...routePages.map(path => ({ path })),
        ...blogFeedPages,
      ],
      // Disable route-tree auto-discovery: it produces basepath-naive
      // paths (e.g. `/`) that duplicate the crawl-derived prefixed paths,
      // bloating pages.json and sitemap. Crawling from the seed already
      // reaches every linked page.
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: false,
      },
      sitemap: config.site ? { enabled: true, host: config.site } : { enabled: false },
      router: {
        generatedRouteTree: "routeTree.gen.ts",
        basepath: config.base,
      },
    }),
    react(),
    svgr(),
  ],
})
