import { execFileSync } from "node:child_process"

/** Where a project's files live on GitHub: the repository, the branch and the
 *  project's folder within the repository (empty or slash-terminated). */
export interface Repository {
  owner: string
  name: string
  branch: string
  prefix: string
}

/** The project's GitHub repository, read from git's `origin`; undefined outside a
 *  git checkout or for a remote that is not on GitHub. */
export function readRepository(cwd: string) {
  const remote = runGit(cwd, ["remote", "get-url", "origin"])
  const parsed = remote ? parseGithubRemote(remote) : undefined
  if (!parsed) return undefined
  const head = runGit(cwd, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"])
  const current = runGit(cwd, ["symbolic-ref", "--short", "HEAD"])
  // A local-only branch has no edit page on GitHub.
  const pushed = current && runGit(cwd, ["rev-parse", "--verify", `origin/${current}`])
  const branch = head?.replace(/^origin\//, "") || (pushed ? current : "main")
  const prefix = runGit(cwd, ["rev-parse", "--show-prefix"]) ?? ""
  return { ...parsed, branch, prefix } satisfies Repository
}

/** Split a GitHub remote URL (HTTPS or SSH) into owner and repository name. */
export function parseGithubRemote(url: string) {
  const match = /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(url.trim())
  if (!match?.[1] || !match[2]) return undefined
  return { owner: match[1], name: match[2] }
}

/** The GitHub edit page of a project file; undefined for a generated one. */
export function buildEditUrl(repository: Repository, file: string) {
  if (file.startsWith(".livemark/")) return undefined
  const { owner, name, branch, prefix } = repository
  return `https://github.com/${owner}/${name}/edit/${branch}/${prefix}${file}`
}

function runGit(cwd: string, args: string[]) {
  try {
    const output = execFileSync("git", args, {
      cwd,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return output.trim() || undefined
  } catch {
    return undefined
  }
}
