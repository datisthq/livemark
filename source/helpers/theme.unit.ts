import { describe, expect, it, vi } from "vite-plus/test"
import { buildThemeScript, resolveTheme } from "./theme.ts"

function runThemeScript(stored: string | null, prefersDark: boolean) {
  const classes = new Set<string>()
  vi.stubGlobal("localStorage", { getItem: () => stored })
  vi.stubGlobal("matchMedia", () => ({ matches: prefersDark }))
  vi.stubGlobal("document", {
    documentElement: { classList: { add: (name: string) => classes.add(name) } },
  })
  new Function(buildThemeScript())()
  vi.unstubAllGlobals()
  return classes.has("dark") ? "dark" : "light"
}

describe("buildThemeScript", () => {
  it.each([
    ["light", false],
    ["light", true],
    ["dark", false],
    ["dark", true],
    ["system", false],
    ["system", true],
  ] as const)("paints what resolveTheme(%s, prefersDark %s) does", (pref, dark) => {
    expect(runThemeScript(pref, dark)).toBe(resolveTheme(pref, dark))
  })

  it.each([null, "", "auto"])("follows the OS for a stored %j", stored => {
    expect(runThemeScript(stored, true)).toBe("dark")
    expect(runThemeScript(stored, false)).toBe("light")
  })
})
