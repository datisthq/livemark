import { existsSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"

/** The modules whose Livemark-site twin `<name>.site.<ext>` replaces them in a site
 *  build: the clean one serves a standalone app, the twin reads the virtual modules. */
export const SITE_MODULES: readonly string[] = [
  "helpers/article-link.ts",
  "helpers/dynamic-icon-resolver.tsx",
  "helpers/site-messages.ts",
]

/** The twin a relative import resolves to when it names a site module in the target,
 *  so every importer, an escape included, gets the Livemark-site behaviour. */
export function resolveSiteModule(props: {
  id: string
  importer: string | undefined
  targetDir: string
}) {
  if (!props.importer || !props.id.startsWith(".")) return undefined
  const [specifier = "", ...query] = props.id.split("?")
  const importer = props.importer.split("?")[0] ?? ""
  const path = relative(props.targetDir, resolve(dirname(importer), specifier))
  const name = path.split(sep).join("/")
  if (!SITE_MODULES.includes(name)) return undefined
  const twin = name.replace(/\.(tsx?)$/, ".site.$1")
  return [join(props.targetDir, twin), ...query].join("?")
}

/** Where `@livemark/markdown/<path>` points in a site: its copy in the target, so an
 *  escape of it applies, and a site module's twin in its place. */
export function resolveMarkdownImport(props: { id: string; targetDir: string }) {
  if (!props.id.startsWith(MARKDOWN_PREFIX)) return undefined
  const [specifier = "", ...query] = props.id.slice(MARKDOWN_PREFIX.length).split("?")
  const name = [specifier, ...MOUNT_EXTENSIONS.map(ext => specifier + ext)].find(
    candidate =>
      /\.(tsx?|css)$/.test(candidate) && existsSync(join(props.targetDir, candidate)),
  )
  if (!name) return undefined
  const mounted = SITE_MODULES.includes(name)
    ? name.replace(/\.(tsx?)$/, ".site.$1")
    : name
  return [join(props.targetDir, mounted), ...query].join("?")
}

const MARKDOWN_PREFIX = "@livemark/markdown/"
const MOUNT_EXTENSIONS = [".tsx", ".ts", ".css"]
