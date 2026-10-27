import slugify from "@sindresorhus/slugify"

const GLOB_MAGIC = /[*?[\]{}()!]/

/** An article's URL path: its frontmatter `path` with leading and trailing slashes,
 *  else its folders below the matching include glob's static base and its slugified
 *  name, an `index` file naming its folder. */
export function resolveArticlePath(props: {
  file: string
  name: string
  include: readonly string[]
  path?: string
}) {
  if (props.path) return wrapSlashes(props.path)
  const file = props.file.replaceAll("\\", "/")
  const base = props.include
    .map(readGlobBase)
    .filter(prefix => file.startsWith(prefix))
    .reduce((longest, prefix) => (prefix.length > longest.length ? prefix : longest), "")
  const folders = file.slice(base.length).split("/").slice(0, -1)
  const segments = props.name === "index" ? folders : [...folders, props.name]
  return wrapSlashes(segments.map(segment => slugify(segment)).join("/"))
}

function readGlobBase(pattern: string) {
  const segments = pattern.replaceAll("\\", "/").replace(/^\.\//, "").split("/")
  const magic = segments.findIndex(segment => GLOB_MAGIC.test(segment))
  const fixed = magic === -1 ? segments.slice(0, -1) : segments.slice(0, magic)
  return fixed.map(segment => `${segment}/`).join("")
}

function wrapSlashes(path: string) {
  const trimmed = path.replace(/^\/+|\/+$/g, "")
  return trimmed ? `/${trimmed}/` : "/"
}
