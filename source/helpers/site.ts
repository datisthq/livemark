import type { Config } from "../models/config.ts"
import { WebsiteConfig } from "../models/config.ts"
import type { Language, Localized, SiteLanguage } from "../models/language.ts"
import { Messages } from "../models/message.ts"
import type { Site } from "../models/site.ts"
import { de } from "../messages/de.ts"
import { es } from "../messages/es.ts"
import { fr } from "../messages/fr.ts"
import { ja } from "../messages/ja.ts"
import { ru } from "../messages/ru.ts"
import { zh } from "../messages/zh.ts"

const BUNDLED_MESSAGES: Record<string, Messages> = { de, es, fr, ja, ru, zh }
const RTL_LANGUAGES = new Set([
  "ar",
  "dv",
  "fa",
  "he",
  "ks",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
])
const LANGUAGE_FLAGS: Record<string, string> = {
  ar: "sa",
  cs: "cz",
  da: "dk",
  de: "de",
  el: "gr",
  en: "gb",
  es: "es",
  fa: "ir",
  fi: "fi",
  fr: "fr",
  he: "il",
  hi: "in",
  hu: "hu",
  id: "id",
  it: "it",
  ja: "jp",
  ko: "kr",
  nb: "no",
  nl: "nl",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  ru: "ru",
  sv: "se",
  th: "th",
  tr: "tr",
  uk: "ua",
  vi: "vn",
  zh: "cn",
}
const IMPLICIT_LANGUAGE: Language = { code: "en", label: "English" }

/** The parsed config fields a site is built from. */
export type SiteSource = Pick<
  Config,
  | "site"
  | "favicon"
  | "logo"
  | "head"
  | "base"
  | "title"
  | "description"
  | "banner"
  | "links"
  | "sections"
  | "languages"
>

/** Build every language's site from a config; a config without `languages` gets one
 *  implicit English site, so its output matches a single-language build. */
export function buildSites(config: SiteSource) {
  const languages = resolveLanguages(config.languages)
  const declared = config.languages ?? [IMPLICIT_LANGUAGE]
  const [defaultLanguage] = languages
  const buildSite = (language: SiteLanguage, index: number) => ({
    language,
    config: buildSiteConfig(config, language, defaultLanguage),
    messages: buildMessages(language, declared[index]?.messages),
  })
  const [first, ...rest] = languages
  return [buildSite(first, 0), ...rest.map((l, i) => buildSite(l, i + 1))] satisfies [
    Site,
    ...Site[],
  ]
}

/** Fill a language's defaults: locale, direction and URL prefix. */
export function resolveLanguages(
  languages: Language[] | undefined,
): [SiteLanguage, ...SiteLanguage[]] {
  const [first = IMPLICIT_LANGUAGE, ...rest] = languages ?? []
  return [resolveLanguage(first, true), ...rest.map(l => resolveLanguage(l, false))]
}

/** Pick a text's value for a language, falling back to the default language's. */
export function localizeText(
  text: Localized,
  language: SiteLanguage,
  defaultLanguage: SiteLanguage,
) {
  if (typeof text === "string") return text
  return text[language.code] ?? text[defaultLanguage.code] ?? Object.values(text)[0] ?? ""
}

/** Move a site-absolute path into a language's URL space; the default keeps it as is. */
export function localizePath(path: string, language: SiteLanguage) {
  if (language.default || !path.startsWith("/") || path.startsWith("//")) return path
  return `${language.prefix}${path.slice(1)}`
}

/** Undo {@link localizePath}: the path a page has in the default language. */
export function unlocalizePath(path: string, language: SiteLanguage) {
  if (language.default || !path.startsWith(language.prefix)) return path
  return `/${path.slice(language.prefix.length)}`
}

/** The site whose language prefix the pathname sits under, else the default one. */
export function matchSite<S extends { language: SiteLanguage }>(
  pathname: string,
  sites: readonly [S, ...S[]],
) {
  const current = `/${pathname.replace(/^\/|\/$/g, "")}/`
  const [first, ...rest] = sites
  return rest.find(site => current.startsWith(site.language.prefix)) ?? first
}

/** Find an article's language: frontmatter `language`, else a `.<code>.md` file-name
 *  suffix naming a site language, else the default. `name` is the file name without
 *  that suffix and the extension. */
export function detectLanguage(props: {
  file: string
  language?: string
  languages: readonly [SiteLanguage, ...SiteLanguage[]]
}) {
  const stem = props.file.replace(/\.\w+$/, "")
  const match = /^(.+)\.([a-z][a-z0-9-]*)$/.exec(stem)
  const suffixed = match && props.languages.find(l => l.code === match[2])
  const name = suffixed && match[1] ? match[1] : stem
  if (props.language) {
    const declared = props.languages.find(l => l.code === props.language)
    if (!declared) {
      throw new Error(`${props.file}: language "${props.language}" is not configured`)
    }
    return { language: declared, name }
  }
  return { language: suffixed || props.languages[0], name }
}

/** An article's URL in its language: the default keeps its path, others gain a prefix. */
export function localizeArticlePath(path: string, language: SiteLanguage) {
  if (language.default) return path
  return path.startsWith("/") ? localizePath(path, language) : `${language.code}/${path}`
}

/** Fill `{name}` placeholders in a message. */
export function formatMessage(message: string, values?: Record<string, string>) {
  if (!values) return message
  return message.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match)
}

/** Reject a section whose prefix would shadow a language's URL space. */
export function assertLanguagePrefixes(
  config: Pick<SiteSource, "sections" | "languages">,
) {
  const languages = resolveLanguages(config.languages).filter(l => !l.default)
  for (const section of config.sections ?? []) {
    if (section.type === "custom") continue
    const clash = languages.find(l => section.prefix.startsWith(l.prefix))
    if (clash) {
      throw new Error(
        `Section prefix "${section.prefix}" collides with language "${clash.code}"`,
      )
    }
  }
}

function resolveLanguage(language: Language, isDefault: boolean): SiteLanguage {
  const locale = language.locale ?? language.code
  return {
    code: language.code,
    label: language.label,
    locale,
    dir: language.dir ?? (RTL_LANGUAGES.has(primarySubtag(locale)) ? "rtl" : "ltr"),
    flag: language.flag ?? defaultFlag(locale),
    prefix: isDefault ? "/" : `/${language.code}/`,
    default: isDefault,
  }
}

function buildSiteConfig(
  config: SiteSource,
  language: SiteLanguage,
  defaultLanguage: SiteLanguage,
) {
  const localize = (text: Localized) => localizeText(text, language, defaultLanguage)
  const localizeOptional = (text: Localized | undefined) =>
    text === undefined ? undefined : localize(text)
  return WebsiteConfig.parse({
    site: config.site,
    favicon: config.favicon,
    logo: config.logo,
    head: config.head,
    base: config.base,
    title: localize(config.title),
    description: localize(config.description),
    banner: localizeOptional(config.banner),
    links: config.links?.map(link => ({
      ...link,
      title: localize(link.title),
      prefix: link.prefix === undefined ? undefined : localizePath(link.prefix, language),
    })),
    sections: config.sections?.map(section => ({
      ...section,
      title: localize(section.title),
      siteTitle: localizeOptional(section.siteTitle),
      siteDescription: localizeOptional(section.siteDescription),
      ...(section.type === "article" || section.type === "blog"
        ? { prefix: localizePath(section.prefix, language) }
        : {}),
    })),
  })
}

function buildMessages(language: SiteLanguage, overrides: Language["messages"]) {
  const bundled = BUNDLED_MESSAGES[primarySubtag(language.locale)]
  return Messages.parse({ ...bundled, ...overrides })
}

// A language is flagged by a country: the locale's region when it names one
// (`pt-BR` → Brazil), else the country most associated with the language.
function defaultFlag(locale: string) {
  const [, ...subtags] = locale.split("-")
  const region = subtags.find(subtag => /^[A-Za-z]{2}$/.test(subtag))
  return region?.toLowerCase() ?? LANGUAGE_FLAGS[primarySubtag(locale)]
}

function primarySubtag(locale: string) {
  return (locale.split("-")[0] ?? locale).toLowerCase()
}
