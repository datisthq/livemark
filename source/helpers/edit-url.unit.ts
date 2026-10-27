import { execFileSync } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { buildEditUrl, parseGithubRemote, readRepository } from "./edit-url.ts"

describe("parseGithubRemote", () => {
  it("reads HTTPS and SSH remotes", () => {
    const expected = { owner: "acme", name: "docs" }
    expect(parseGithubRemote("https://github.com/acme/docs.git")).toEqual(expected)
    expect(parseGithubRemote("https://github.com/acme/docs")).toEqual(expected)
    expect(parseGithubRemote("git@github.com:acme/docs.git")).toEqual(expected)
    expect(parseGithubRemote("ssh://git@github.com/acme/docs.git")).toEqual(expected)
  })

  it("rejects a remote that is not on GitHub", () => {
    expect(parseGithubRemote("https://gitlab.com/acme/docs.git")).toBeUndefined()
  })
})

describe("buildEditUrl", () => {
  const repository = { owner: "acme", name: "docs", branch: "main", prefix: "site/" }

  it("links a file under the project's folder in the repository", () => {
    expect(buildEditUrl(repository, "docs/intro.md")).toBe(
      "https://github.com/acme/docs/edit/main/site/docs/intro.md",
    )
  })

  it("skips a generated file", () => {
    expect(buildEditUrl(repository, ".livemark/.cache/changelog/v1.md")).toBeUndefined()
  })
})

describe("readRepository", () => {
  it("is undefined outside a git checkout", () =>
    temporaryDirectoryTask(dir => {
      expect(readRepository(dir)).toBeUndefined()
    }))

  it("is undefined without a GitHub origin", () =>
    temporaryDirectoryTask(dir => {
      git(dir, "init", "-q")
      expect(readRepository(dir)).toBeUndefined()
      git(dir, "remote", "add", "origin", "https://gitlab.com/acme/docs.git")
      expect(readRepository(dir)).toBeUndefined()
    }))

  it("reads the repository, branch and the project's folder", () =>
    temporaryDirectoryTask(async dir => {
      git(dir, "init", "-q", "-b", "trunk")
      git(dir, "remote", "add", "origin", "git@github.com:acme/docs.git")
      await mkdir(join(dir, "site"))
      expect(readRepository(dir)?.branch).toBe("main")
      git(dir, ...IDENTITY, "commit", "-q", "--allow-empty", "-m", "first")
      git(dir, "update-ref", "refs/remotes/origin/trunk", "HEAD")
      expect(readRepository(join(dir, "site"))).toEqual({
        owner: "acme",
        name: "docs",
        branch: "trunk",
        prefix: "site/",
      })
    }))
})

const IDENTITY = ["-c", "user.name=test", "-c", "user.email=test@example.com"]

function git(cwd: string, ...args: string[]) {
  execFileSync("git", args, { cwd, stdio: "ignore" })
}
