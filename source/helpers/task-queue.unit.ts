import { describe, expect, it } from "vite-plus/test"
import { createTaskQueue } from "./task-queue.ts"

describe("createTaskQueue", () => {
  it("runs one task at a time", async () => {
    const queue = createTaskQueue({ onError: () => {} })
    const log: string[] = []
    const task = (name: string, ms: number) => async () => {
      log.push(`start ${name}`)
      await new Promise(resolve => setTimeout(resolve, ms))
      log.push(`end ${name}`)
    }
    queue.enqueue("a", task("a", 30))
    await queue.enqueue("b", task("b", 1))
    expect(log).toEqual(["start a", "end a", "start b", "end b"])
  })

  it("collapses a key enqueued again before it starts", async () => {
    const queue = createTaskQueue({ onError: () => {} })
    const runs: string[] = []
    queue.enqueue("first", async () => runs.push("first"))
    queue.enqueue("file", async () => runs.push("stale"))
    await queue.enqueue("file", async () => runs.push("latest"))
    expect(runs).toEqual(["first", "latest"])
  })

  it("reruns a key enqueued while it is running", async () => {
    const queue = createTaskQueue({ onError: () => {} })
    const runs: number[] = []
    let release = () => {}
    queue.enqueue("file", async () => {
      runs.push(1)
      await new Promise<void>(resolve => (release = resolve))
    })
    const done = queue.enqueue("file", async () => runs.push(2))
    release()
    await done
    expect(runs).toEqual([1, 2])
  })

  it("reports a failed task and keeps draining", async () => {
    const errors: unknown[] = []
    const queue = createTaskQueue({ onError: error => errors.push(error) })
    const runs: string[] = []
    queue.enqueue("a", async () => {
      throw new Error("boom")
    })
    await queue.enqueue("b", async () => runs.push("b"))
    expect(errors).toHaveLength(1)
    expect(runs).toEqual(["b"])
  })

  it("starts a fresh drain after the previous one finished", async () => {
    const queue = createTaskQueue({ onError: () => {} })
    const runs: string[] = []
    await queue.enqueue("a", async () => runs.push("a"))
    await queue.enqueue("a", async () => runs.push("again"))
    expect(runs).toEqual(["a", "again"])
  })
})
