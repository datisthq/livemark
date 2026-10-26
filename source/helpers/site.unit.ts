import { describe, expect, it } from "vite-plus/test"
import { defineConfig } from "../actions/config/define.ts"
import { WebsiteConfig } from "../models/config.ts"
import type { UserConfig } from "../models/config.ts"
import {
  buildSites,
  detectLanguage,
  formatMessage,
  localizeArticlePath,
  localizePath,
  localizeText,
  matchSite,
  resolveLanguages,
  unlocalizePath,
} from "./site.ts"

const languages = resolveLanguages([
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
])
const [en] = languages
const es = findLanguage("es")

function findLanguage(code: string) {
  const language = languages.find(l => l.code === code)
  if (!language) throw new Error(`no ${code}`)
  return language
}

function buildFrom(input: UserConfig) {
  return buildSites({ ...defineConfig(input), base: undefined })
}

describe("resolveLanguages", () => {
  it("serves the first language unprefixed and the rest under their code", () => {
    expect(en).toMatchObject({ prefix: "/", default: true, locale: "en", dir: "ltr" })
    expect(es).toMatchObject({ prefix: "/es/", default: false, locale: "es" })
  })

  it("infers right-to-left from the locale", () => {
    expect(findLanguage("ar").dir).toBe("rtl")
  })

  it("falls back to one implicit English language", () => {
    expect(resolveLanguages(undefined)).toEqual([
      {
        code: "en",
        label: "English",
        locale: "en",
        dir: "ltr",
        prefix: "/",
        default: true,
      },
    ])
  })
})

describe("localizeText", () => {
  it("returns a plain string as is", () => {
    expect(localizeText("Docs", es, en)).toBe("Docs")
  })

  it("picks the language's value, then the default language's", () => {
    expect(localizeText({ en: "Docs", es: "Documentos" }, es, en)).toBe("Documentos")
    expect(localizeText({ en: "Docs" }, es, en)).toBe("Docs")
  })
})

describe("localizePath", () => {
  it("prefixes a path for a non-default language and strips it back", () => {
    expect(localizePath("/guide/", es)).toBe("/es/guide/")
    expect(unlocalizePath("/es/guide/", es)).toBe("/guide/")
  })

  it("keeps the default language's paths and external URLs", () => {
    expect(localizePath("/guide/", en)).toBe("/guide/")
    expect(localizePath("https://x.dev/", es)).toBe("https://x.dev/")
  })
})

describe("matchSite", () => {
  const sites = [{ language: en }, { language: es }] as const

  it("matches the language whose prefix the path sits under", () => {
    expect(matchSite("/es/guide/", sites).language.code).toBe("es")
    expect(matchSite("/es", sites).language.code).toBe("es")
  })

  it("falls back to the default language", () => {
    expect(matchSite("/guide/", sites).language.code).toBe("en")
    expect(matchSite("/escape/", sites).language.code).toBe("en")
  })
})

describe("detectLanguage", () => {
  const pair = [en, es] as const

  it("reads a language suffix from the file name", () => {
    const detected = detectLanguage({ file: "guide.es.md", languages: pair })
    expect(detected.language.code).toBe("es")
    expect(detected.name).toBe("guide")
  })

  it("leaves a suffix that names no language in the name", () => {
    const detected = detectLanguage({ file: "vite.config.md", languages: pair })
    expect(detected.language.code).toBe("en")
    expect(detected.name).toBe("vite.config")
  })

  it("prefers the frontmatter language", () => {
    expect(
      detectLanguage({ file: "hola.md", language: "es", languages: pair }).language.code,
    ).toBe("es")
  })

  it("rejects a frontmatter language that is not configured", () => {
    expect(() =>
      detectLanguage({ file: "a.md", language: "fr", languages: pair }),
    ).toThrow(/not configured/)
  })
})

describe("localizeArticlePath", () => {
  it("prefixes a non-default article's path", () => {
    expect(localizeArticlePath("/", es)).toBe("/es/")
    expect(localizeArticlePath("/guide/", es)).toBe("/es/guide/")
    expect(localizeArticlePath("/guide/", en)).toBe("/guide/")
  })
})

describe("formatMessage", () => {
  it("fills placeholders and keeps unknown ones", () => {
    expect(formatMessage("Posts tagged '{tag}' {x}", { tag: "news" })).toBe(
      "Posts tagged 'news' {x}",
    )
  })
})

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
      ["/es/", "/es/blog/", "/changelog/", "https://github.com"],
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

describe("defineConfig languages", () => {
  it("rejects duplicate language codes", () => {
    expect(() =>
      defineConfig({
        languages: [
          { code: "en", label: "English" },
          { code: "en", label: "Again" },
        ],
      }),
    ).toThrow(/unique/)
  })

  it("rejects a section prefix inside a language's URL space", () => {
    expect(() =>
      defineConfig({
        languages: [
          { code: "en", label: "English" },
          { code: "es", label: "Español" },
        ],
        sections: [{ title: "Spanish", prefix: "/es/" }],
      }),
    ).toThrow(/collides/)
  })

  it("rejects an unknown message key", () => {
    expect(() =>
      defineConfig(
        JSON.parse(
          '{"languages":[{"code":"en","label":"E","messages":{"no.such":"x"}}]}',
        ),
      ),
    ).toThrow()
  })
})
