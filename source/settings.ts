/** Subdirs of source/ where consumer files in `.livemark/<folder>/` are
 *  merged per-file into the runtime mount, with `.livemark` winning on
 *  conflict. */
export const ESCAPABLE_FOLDERS: readonly string[] = [
  "components",
  "elements",
  "styles",
  "routes",
  "public",
]

/** Top-level source files that `.livemark/<file>` can replace atomically. */
export const ESCAPABLE_FILES: readonly string[] = [
  "client.tsx",
  "server.ts",
  "router.tsx",
]

/** Glob patterns auto-excluded from content scanning when the consumer's
 *  project doesn't ship a `.gitignore` to declare its own exclusions. */
export const DEFAULT_EXCLUDES: readonly string[] = [
  "**/node_modules/**",
  "**/.git/**",
  "**/build/**",
  "**/dist/**",
]
