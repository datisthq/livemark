import { describe, expect, it } from "vite-plus/test"
import { WebsiteConfig } from "../../models/config.ts"
import type { UserConfig } from "../../models/config.ts"
import { defineConfig } from "../config/define.ts"
import { buildSites } from "./build.ts"

function buildFrom(input: UserConfig) {
  return buildSites({ ...defineConfig(input), base: undefined })
}

describe("buildSites", () => {
  it("builds one site matching the plain config when no languages are set", () => {
    const input: UserConfig = {
      title: "Docs",
      sections: [{ title: "Guide", prefix: "/" }],
      links: [{ title: "GitHub", url: "https://github.com" }],
    }
    const sites = buildFrom(input)
    expect(sites).toHaveLength(1)
    expect(sites[0].config).toEqual(WebsiteConfig.parse(defineConfig(input)))
    expect(sites[0].messages["toc.title"]).toBe("On this page")
  })

  it("localizes texts and mirrors routed sections for each language", () => {
    const sites = buildFrom({
      title: { en: "Docs", es: "Documentos" },
      languages: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
      sections: [
        { title: { en: "Guide", es: "Guía" }, prefix: "/" },
        { title: "Blog", prefix: "/blog/", type: "blog" },
        { title: "Changes", prefix: "/changelog/", type: "changelog", source: "C.md" },
        { title: "GitHub", type: "custom", url: "https://github.com" },
      ],
    })
    const spanish = sites[1]?.config
    expect(spanish?.title).toBe("Documentos")
    expect(spanish?.sections?.map(s => (s.type === "custom" ? s.url : s.prefix))).toEqual(
      ["/es/", "/es/blog/", "/es/changelog/", "https://github.com"],
    )
    expect(spanish?.sections?.[0]?.title).toBe("Guía")
  })

  it("layers project overrides over the bundled UI strings", () => {
    const sites = buildFrom({
      languages: [
        { code: "en", label: "English" },
        { code: "es", label: "Español", messages: { "toc.title": "Índice" } },
      ],
    })
    expect(sites[1]?.messages["toc.title"]).toBe("Índice")
    expect(sites[1]?.messages["nav.next"]).toBe("Siguiente")
  })
})
