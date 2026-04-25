/** Sub-directories of `website/` that participate in the override mechanism. */
export const OVERRIDE_SUBDIRS: readonly string[] = [
  "components",
  "elements",
  "styles",
]

/** Glob patterns auto-excluded from content scanning when the consumer's
 *  project doesn't ship a `.gitignore` to declare its own exclusions. */
export const DEFAULT_EXCLUDES: readonly string[] = [
  "**/node_modules/**",
  "**/.git/**",
  "**/build/**",
  "**/dist/**",
]
