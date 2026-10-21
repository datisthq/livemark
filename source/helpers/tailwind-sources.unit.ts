import { describe, expect, it } from "vite-plus/test"
import { excludeTailwindSources } from "./tailwind-sources.ts"

const targetDir = "/project/.livemark/.serve"

describe("excludeTailwindSources", () => {
  it("excludes the dependency link and the content cache from a Tailwind entry", () => {
    const css = `@import "tailwindcss";\n@import "./shape.css";`
    expect(excludeTailwindSources({ css, targetDir })).toBe(
      `${css}\n@source not "/project/.livemark/.serve/node_modules";\n` +
        `@source not "/project/.livemark/.serve/.content-collections/cache";\n`,
    )
  })

  it("accepts single quotes, import options and a bare utilities layer", () => {
    for (const css of [
      `@import 'tailwindcss' source(none);`,
      `@import "tailwindcss/utilities" layer(utilities);`,
    ]) {
      expect(excludeTailwindSources({ css, targetDir })).toContain("@source not")
    }
  })

  it("leaves other stylesheets alone", () => {
    expect(
      excludeTailwindSources({ css: `@import "tw-animate-css";`, targetDir }),
    ).toBeUndefined()
    expect(
      excludeTailwindSources({ css: `@import "tailwindcss/theme";`, targetDir }),
    ).toBeUndefined()
  })
})
