/** Resolve a base config field — accepts a string, a function of the
 *  form `(command) => string | undefined` (where `command` matches
 *  Vite's `ConfigEnv.command`), or undefined. Normalizes the result to
 *  either `undefined` (no base) or a leading-slash, no-trailing-slash
 *  string (e.g. `"repo"` and `"/repo/"` both → `"/repo"`). */
export function resolveBase(input: unknown, command: "build" | "serve") {
  const raw = typeof input === "function" ? input(command) : input
  if (typeof raw !== "string" || !raw) return undefined
  const trimmed = raw.replace(/^\/|\/$/g, "")
  return trimmed ? `/${trimmed}` : undefined
}
