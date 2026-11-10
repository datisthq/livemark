/** One step of a breadcrumb trail; a folder without a page of its own has no `path`. */
export interface Crumb {
  title: string
  path?: string
}

/** The folders between a language's home and an article, each named by the page at
 *  its path when `findCrumb` knows one, else by its URL segment. The home page has none. */
export function buildBreadcrumbs(
  path: string,
  home: string,
  findCrumb: (folder: string) => Crumb | undefined,
) {
  if (!path.startsWith(home) || path === home) return undefined
  const segments = path.slice(home.length).replace(/\/$/, "").split("/")
  return segments.slice(0, -1).map((name, index) => {
    const folder = `${home}${segments.slice(0, index + 1).join("/")}/`
    return findCrumb(folder) ?? { title: name }
  })
}
