import { execFileSync, spawnSync } from "node:child_process"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"

const MAIN = join(import.meta.dirname, "entrypoints", "main.ts")

function runCli(args: string[], cwd?: string) {
  return JSON.parse(execFileSync("node", [MAIN, ...args], { cwd, encoding: "utf8" }))
}

describe("program", () => {
  it("lists every command as a tool under --llms", () => {
    const manifest = runCli(["--llms"])
    const names = manifest.tools.map((tool: { name: string }) => tool.name)
    expect(names).toEqual(["help", "start", "build", "preview", "escape", "clear"])
  })

  it("lists escapable files as JSON without opening the picker", () => {
    const output = runCli(["escape", "--json"])
    expect(output.action).toBe("list")
    expect(output.files).toContainEqual(expect.objectContaining({ path: "client.tsx" }))
  })

  it("copies an escape from JSON input", () =>
    temporaryDirectoryTask(tmpDir => {
      const input = JSON.stringify({ paths: ["components/Footer.tsx"] })
      const output = runCli(["escape", "--json", input], tmpDir)
      expect(output).toEqual({
        action: "copy",
        files: [{ path: "components/Footer.tsx", escaped: true }],
      })
    }))

  it("reports a failed command as one line of error, not a stack trace", () =>
    temporaryDirectoryTask(tmpDir => {
      const run = spawnSync("node", [MAIN, "build", "--config", "missing.ts"], {
        cwd: tmpDir,
        encoding: "utf8",
        env: { ...process.env, DEBUG: "" },
      })
      expect(run.status).toBe(1)
      expect(run.stderr).toContain("Error: Config file not found:")
      expect(run.stderr).not.toMatch(/^\s+at /m)
    }))

  it("formats a command's help like the program's", () => {
    const help = execFileSync("node", [MAIN, "build", "--help"], { encoding: "utf8" })
    expect(help).toMatch(/^USAGE /m)
    expect(help).toMatch(/^OPTIONS$/m)
  })
})
