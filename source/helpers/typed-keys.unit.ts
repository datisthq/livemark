import { describe, expect, it, vi } from "vite-plus/test"
import { holdTypedKeys } from "./typed-keys.ts"

describe("holdTypedKeys", () => {
  it("collects printable keys and keeps them from later listeners", () => {
    const target = new EventTarget()
    const held = holdTypedKeys(target)
    const later = vi.fn()
    target.addEventListener("keydown", later)

    for (const key of ["d", "e", "x", "Backspace", "p", "Shift", " "]) press(target, key)

    expect(held.release()).toBe("dep ")
    expect(later).toHaveBeenCalledTimes(1)
  })

  it("lets shortcuts with a modifier through and stops after release", () => {
    const target = new EventTarget()
    const held = holdTypedKeys(target)
    const later = vi.fn()
    target.addEventListener("keydown", later)

    press(target, "k", { ctrlKey: true })
    held.release()
    press(target, "a")

    expect(held.release()).toBe("")
    expect(later).toHaveBeenCalledTimes(2)
  })

  it("lets keys typed into a field through", () => {
    const field = Object.assign(new EventTarget(), { tagName: "INPUT" })
    const held = holdTypedKeys(field)
    const later = vi.fn()
    field.addEventListener("keydown", later)

    press(field, "a")

    expect(held.release()).toBe("")
    expect(later).toHaveBeenCalledTimes(1)
  })
})

function press(target: EventTarget, key: string, init: { ctrlKey?: boolean } = {}) {
  const event = Object.assign(new Event("keydown", { cancelable: true }), {
    key,
    ctrlKey: init.ctrlKey ?? false,
    metaKey: false,
    altKey: false,
  })
  target.dispatchEvent(event)
}
