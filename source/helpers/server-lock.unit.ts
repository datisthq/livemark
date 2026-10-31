import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { claimServerLock, readServerLock } from "./server-lock.ts"

describe("claimServerLock", () => {
  it("claims a free project and releases it", () =>
    temporaryDirectoryTask(root => {
      const configPath = join(root, "livemark.config.ts")

      const lock = claimServerLock(configPath)
      lock.announce("http://localhost:8000/")

      expect(readServerLock(configPath)).toEqual({
        pid: process.pid,
        url: "http://localhost:8000/",
      })
      lock.release()
      expect(readServerLock(configPath)).toBeUndefined()
    }))

  it("refuses a project another live server holds, naming its URL", () =>
    temporaryDirectoryTask(root => {
      const configPath = join(root, "livemark.config.ts")
      hold(root, { pid: process.ppid, url: "http://localhost:8001/" })

      expect(() => claimServerLock(configPath)).toThrow(
        `livemark start is already running for this project (pid ${process.ppid}) at http://localhost:8001/`,
      )
    }))

  it("takes over the lock of a server that is gone", () =>
    temporaryDirectoryTask(root => {
      const configPath = join(root, "livemark.config.ts")
      hold(root, { pid: 2 ** 22 + 1 })

      claimServerLock(configPath).release()

      expect(existsSync(join(root, ".livemark", ".serve", "server.lock"))).toBe(false)
    }))
})

function hold(root: string, lock: { pid: number; url?: string }) {
  mkdirSync(join(root, ".livemark", ".serve"), { recursive: true })
  writeFileSync(join(root, ".livemark", ".serve", "server.lock"), JSON.stringify(lock))
}
