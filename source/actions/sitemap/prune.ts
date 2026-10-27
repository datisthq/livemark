import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { readCanonical, removeNonCanonicalUrls } from "../../helpers/sitemap.ts"

/** Rewrite the built `sitemap.xml` without pages whose canonical points elsewhere,
 *  such as a changelog entry shown in another language or an anchor on a page. */
export function pruneSitemap(props: { clientDir: string; site: string; base?: string }) {
  const file = join(props.clientDir, "sitemap.xml")
  if (!existsSync(file)) return
  const origin = `${props.site.replace(/\/+$/, "")}${props.base ?? ""}`
  const xml = readFileSync(file, "utf-8")
  const pruned = removeNonCanonicalUrls(xml, loc => {
    if (!loc.startsWith(origin)) return undefined
    // The crawler records `/guide/#install` as a page of its own; its file is the
    // page's, whose canonical then drops the anchored entry.
    const path = loc.slice(origin.length).split(/[?#]/)[0] ?? ""
    const page = join(props.clientDir, path, "index.html")
    return existsSync(page) ? readCanonical(readFileSync(page, "utf-8")) : undefined
  })
  if (pruned !== xml) writeFileSync(file, pruned)
}
