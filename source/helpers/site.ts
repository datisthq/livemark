import type { Config } from "../models/config.ts"
import type { Language, Localized, SiteLanguage } from "../models/language.ts"

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
/** The one language of a config that declares none. */
export const IMPLICIT_LANGUAGE: Language = { code: "en", label: "English" }

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
  | "breadcrumbs"
  | "links"
  | "sections"
  | "languages"
>

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
    dir: language.dir ?? (RTL_LANGUAGES.has(readPrimarySubtag(locale)) ? "rtl" : "ltr"),
    flag: language.flag ?? defaultFlag(locale),
    prefix: isDefault ? "/" : `/${language.code}/`,
    default: isDefault,
  }
}

// A language is flagged by a country: the locale's region when it names one
// (`pt-BR` → Brazil), else the country most associated with the language.
function defaultFlag(locale: string) {
  const [, ...subtags] = locale.split("-")
  const region = subtags.find(subtag => /^[A-Za-z]{2}$/.test(subtag))
  return region?.toLowerCase() ?? LANGUAGE_FLAGS[readPrimarySubtag(locale)]
}

/** A locale's language subtag, lowercased: `pt-BR` → `pt`. */
export function readPrimarySubtag(locale: string) {
  return (locale.split("-")[0] ?? locale).toLowerCase()
}
