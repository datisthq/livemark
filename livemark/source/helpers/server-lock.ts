import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

/** Claim the project's dev server: two `livemark start` runs share `.livemark/.serve/`
 *  and overwrite each other's files. Throws while another live process holds it. */
export function claimServerLock(configPath: string) {
  const path = lockPathFor(configPath)
  const held = findLiveServer(configPath)
  if (held && held.pid !== process.pid) {
    const where = held.url ? ` at ${held.url}` : ""
    throw new Error(
      `livemark start is already running for this project (pid ${held.pid})${where}`,
    )
  }
  const write = (url?: string) => {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, JSON.stringify({ pid: process.pid, url }))
  }
  write()
  return {
    /** Record the URL the server listens on, for a second run's message. */
    announce: (url?: string) => write(url),
    /** Give the project up, if this process still holds it. */
    release() {
      if (readServerLock(configPath)?.pid === process.pid) rmSync(path, { force: true })
    },
  }
}

/** The process holding the project's dev server, and its URL, if any. */
export function readServerLock(configPath: string) {
  try {
    const lock: unknown = JSON.parse(readFileSync(lockPathFor(configPath), "utf-8"))
    if (typeof lock !== "object" || lock === null || !("pid" in lock)) return undefined
    const pid = Number(lock.pid)
    const url = "url" in lock && typeof lock.url === "string" ? lock.url : undefined
    return url ? { pid, url } : { pid }
  } catch {
    return undefined
  }
}

/** The live process serving the project, if one is. */
export function findLiveServer(configPath: string) {
  const held = readServerLock(configPath)
  return held && isAlive(held.pid) ? held : undefined
}

function lockPathFor(configPath: string) {
  return join(dirname(configPath), ".livemark", ".serve", "server.lock")
}

function isAlive(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    // EPERM: the process exists but belongs to another user
    return error instanceof Error && "code" in error && error.code === "EPERM"
  }
}
