import { useLocation, useRouter } from "@tanstack/react-router"
import { articlePaths, currentSite, listSiteSequence } from "../content/article.ts"
import { findPageNeighbours } from "./page-sequence.ts"

/** The pages H and L lead to from the current one: across sections, and from a landing
 *  page to the first article */
export function usePageNeighbours() {
  const pathname = useLocation({ select: l => l.pathname })
  const routes = useRouter().routesByPath
  const trimmed = pathname.replace(/^\/|\/$/g, "")
  const path = trimmed ? `/${trimmed}/` : "/"
  const site = currentSite(path)
  const home = site.language.prefix
  // A project's landing is its own index route; without one the root redirects away
  const hasLanding =
    articlePaths.has(home) ||
    Object.hasOwn(routes, home) ||
    Object.hasOwn(routes, home.replace(/(.)\/$/, "$1"))
  return findPageNeighbours({
    sequence: listSiteSequence(site),
    path,
    landing: hasLanding ? home : undefined,
  })
}
