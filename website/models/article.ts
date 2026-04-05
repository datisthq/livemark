import { basename } from "node:path"
import slugify from "@sindresorhus/slugify"

/** Derive a URL pathname from a content file path */
export function toPathname(filePath: string) {
  const name = basename(filePath).replace(/\.\w+$/, "")
  return slugify(name)
}
