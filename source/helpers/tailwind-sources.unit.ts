import { describe, expect, it } from "vite-plus/test"
import { excludeDependencySources } from "./tailwind-sources.ts"

const targetDir = "/project/.livemark/.target"

describe("excludeDependencySources", () => {
  it("excludes the dependency link from a Tailwind entry", () => {
    const css = `@import "tailwindcss";\n@import "./shape.css";`
    expect(excludeDependencySources({ css, targetDir })).toBe(
      `${css}\n@source not "/project/.livemark/.target/node_modules";\n`,
    )
  })

  it("accepts single quotes, import options and a bare utilities layer", () => {
    for (const css of [
      `@import 'tailwindcss' source(none);`,
      `@import "tailwindcss/utilities" layer(utilities);`,
    ]) {
      expect(excludeDependencySources({ css, targetDir })).toContain("@source not")
    }
  })

  it("leaves other stylesheets alone", () => {
    expect(
      excludeDependencySources({ css: `@import "tw-animate-css";`, targetDir }),
    ).toBeUndefined()
    expect(
      excludeDependencySources({ css: `@import "tailwindcss/theme";`, targetDir }),
    ).toBeUndefined()
  })
})
