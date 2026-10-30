import { join, sep } from "node:path"

const TAILWIND_IMPORT = /@import\s+(["'])tailwindcss(\/utilities)?\1/

/**
 * Keep Tailwind's source scan out of the target's dependency link, which reaches the
 * whole install (and, through a self-link, the whole project) from inside the Vite root.
 * The article modules still carry every article's classes.
 */
export function excludeTailwindSources(props: { css: string; targetDir: string }) {
  if (!TAILWIND_IMPORT.test(props.css)) return undefined
  const absolute = join(props.targetDir, "node_modules").split(sep).join("/")
  return `${props.css}\n@source not "${absolute}";\n`
}
