import { describe, expect, it } from "vite-plus/test"
import { collectIconKeys, renderIconsModule, toIconKey } from "./icon-names.ts"

const known = new Set(["BookOpen", "Rocket", "Code", "FilePenLine"])

describe("toIconKey", () => {
  it("turns a kebab-case name into its Lucide key", () => {
    expect(toIconKey("file-pen-line")).toBe("FilePenLine")
    expect(toIconKey("BookOpen")).toBe("BookOpen")
  })
})

describe("collectIconKeys", () => {
  it("keeps the given names and the quoted ones in texts that Lucide knows", () => {
    const keys = collectIconKeys({
      names: ["rocket", "no-such-icon"],
      texts: [
        '_jsx(Card, { icon: "book-open" })',
        "<DynamicIcon name='code' />",
        "rocket",
      ],
      known,
    })
    expect(keys).toEqual(["BookOpen", "Code", "Rocket"])
  })
})

describe("renderIconsModule", () => {
  it("imports only the listed icons", () => {
    expect(renderIconsModule(["BookOpen", "Code"])).toBe(
      'import { BookOpen, Code } from "lucide-react"\n' +
        "export const icons = { BookOpen, Code }",
    )
    expect(renderIconsModule([])).toBe("export const icons = {}")
  })
})
