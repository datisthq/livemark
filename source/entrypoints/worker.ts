/** Bindings the worker needs: the build's static assets as `ASSETS`. */
export interface WorkerEnv {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

/** Cloudflare Worker over a Livemark build: a page request accepting
 *  `text/markdown` gets the page's Markdown twin, anything else the static asset. */
export default {
  async fetch(request: Request, env: WorkerEnv) {
    const twinPath = buildTwinPath(new URL(request.url).pathname)
    if (!twinPath) return env.ASSETS.fetch(request)
    if (acceptsMarkdown(request)) {
      const url = new URL(request.url)
      url.pathname = twinPath
      const twin = await env.ASSETS.fetch(new Request(url, request))
      if (twin.ok) {
        const response = varyOnAccept(twin)
        response.headers.set("Content-Type", "text/markdown; charset=utf-8")
        return response
      }
    }
    return varyOnAccept(await env.ASSETS.fetch(request))
  },
}

/** Path of the Markdown twin for a page path, or none for a file path. */
export function buildTwinPath(pathname: string) {
  const last = pathname.slice(pathname.lastIndexOf("/") + 1)
  if (last.includes(".")) return undefined
  return pathname.endsWith("/") ? `${pathname}index.md` : `${pathname}/index.md`
}

function acceptsMarkdown(request: Request) {
  return request.headers.get("Accept")?.includes("text/markdown") ?? false
}

// A cache keyed on the URL alone would hand browsers the Markdown an agent got.
function varyOnAccept(response: Response) {
  const varied = new Response(response.body, response)
  varied.headers.append("Vary", "Accept")
  return varied
}
