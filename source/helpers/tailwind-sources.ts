import { join, sep } from "node:path"

const TAILWIND_IMPORT = /@import\s+(["'])tailwindcss(\/utilities)?\1/

/**
 * Keep Tailwind's source scan out of the target's dependency link, which reaches the
 * whole install (and, through a self-link, the whole project) from inside the Vite root,
 * and out of the content-collections cache, whose rewrites Tailwind answers with a
 * full page reload. The generated modules still carry every article's classes.
 */
export function excludeTailwindSources(props: { css: string; targetDir: string }) {
  if (!TAILWIND_IMPORT.test(props.css)) return undefined
  const exclusions = ["node_modules", ".content-collections/cache"].map(path => {
    const absolute = join(props.targetDir, path).split(sep).join("/")
    return `@source not "${absolute}";\n`
  })
  return `${props.css}\n${exclusions.join("")}`
}
