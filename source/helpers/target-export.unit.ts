import { join } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import packageJson from "../../package.json" with { type: "json" }
import { resolveTargetExport } from "./target-export.ts"

const targetDir = "/project/.livemark/.serve"

function resolveId(id: string) {
  return resolveTargetExport({ id, targetDir, exports: packageJson.exports })
}

describe("resolveTargetExport", () => {
  it("maps each source subpath export into the target", () => {
    expect(resolveId("livemark/components/Footer")).toBe(
      join(targetDir, "components/Footer.tsx"),
    )
    expect(resolveId("livemark/elements/button")).toBe(
      join(targetDir, "elements/button.tsx"),
    )
    expect(resolveId("livemark/hooks/in-view")).toBe(join(targetDir, "hooks/in-view.ts"))
    expect(resolveId("livemark/styles/general")).toBe(
      join(targetDir, "styles/general.css"),
    )
  })

  it("keeps the query", () => {
    expect(resolveId("livemark/styles/general?url")).toBe(
      `${join(targetDir, "styles/general.css")}?url`,
    )
  })

  it("leaves other specifiers alone", () => {
    expect(resolveId("livemark")).toBeUndefined()
    expect(resolveId("livemark/unknown/thing")).toBeUndefined()
    expect(resolveId("react")).toBeUndefined()
  })
})
