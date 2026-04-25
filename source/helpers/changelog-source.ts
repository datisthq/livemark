/** Returns true if a changelog source string is a GitHub repo URL */
export function isGitHubUrl(source: string) {
  return /^(https?:\/\/)?(www\.)?github\.com\//.test(source)
}

/** Extract `{ owner, repo }` from a GitHub URL. Returns undefined if unparseable */
export function parseGitHubRepo(source: string) {
  const match = source.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/#?]+)/,
  )
  if (!match) return undefined
  const owner = match[1]
  const repo = match[2]?.replace(/\.git$/, "")
  if (!owner || !repo) return undefined
  return { owner, repo }
}
