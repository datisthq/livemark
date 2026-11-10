import { existsSync, globSync, readFileSync } from "node:fs"
import { join, sep } from "node:path"

/** A prerender failure in words a project author can act on: the pages that link to a
 *  path nothing is built at, or an empty site. Undefined for any other error. */
export function explainPrerenderError(error: unknown, clientDir: string) {
  const match = error instanceof Error ? PRERENDER_404.exec(error.message) : null
  if (!match?.[1]) return undefined
  const href = match[1]
  const sources = findLinkingPages(href, clientDir)
  if (sources.length > 0) {
    return new Error(
      `Broken link "${href}" on ${sources.join(", ")}: no page is built at that path`,
      { cause: error },
    )
  }
  if (href === "/") {
    return new Error(
      "No articles found: the config's `include` matches no Markdown files, so the site has no home page",
      { cause: error },
    )
  }
  return new Error(`Nothing is built at "${href}", a page the build starts from`, {
    cause: error,
  })
}

// TanStack Start's prerender, crawling a link it cannot render
const PRERENDER_404 = /^Failed to fetch (\S+): Not Found$/

function findLinkingPages(href: string, clientDir: string) {
  if (!existsSync(clientDir)) return []
  const attribute = `href="${href}"`
  return globSync("**/index.html", { cwd: clientDir })
    .filter(file => readFileSync(join(clientDir, file), "utf-8").includes(attribute))
    .map(file => `/${file.split(sep).join("/")}`.replace(/index\.html$/, ""))
    .sort()
}
