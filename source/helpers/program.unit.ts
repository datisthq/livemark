import { describe, expect, it } from "vite-plus/test"
import { formatError } from "./program.ts"

describe("formatError", () => {
  it("prints each error a bundler aggregated, without the stack in its summary", () => {
    const inner = new Error("1 article failed to load")
    const wrapper = Object.assign(new Error(`Build failed:\n${inner.stack}`), {
      errors: [inner],
    })

    const printed = formatError(wrapper)

    expect(printed).toContain("Error: 1 article failed to load")
    expect(printed).not.toMatch(/^\s+at /m)
  })
})
