/** Router link options for a site path such as `/docs/intro/`. The root goes to
 *  the index route, since an empty splat on `/$` builds `/` and the router warns. */
export function buildPathLink(path: string) {
  const splat = path.replace(/^\/|\/$/g, "")
  if (!splat) return { to: "/" as const, params: {} }
  return { to: "/$" as const, params: { _splat: splat } }
}
