import type { Language, Localized, SiteLanguage } from "../../models/language.ts"
import { WebsiteConfig } from "../../models/config.ts"
import { Messages } from "../../models/message.ts"
import type { Site } from "../../models/site.ts"
import { de } from "../../messages/de.ts"
import { es } from "../../messages/es.ts"
import { fr } from "../../messages/fr.ts"
import { ja } from "../../messages/ja.ts"
import { ru } from "../../messages/ru.ts"
import { zh } from "../../messages/zh.ts"
import {
  IMPLICIT_LANGUAGE,
  type SiteSource,
  localizePath,
  localizeText,
  readPrimarySubtag,
  resolveLanguages,
} from "../../helpers/site.ts"

const BUNDLED_MESSAGES: Record<string, Messages> = { de, es, fr, ja, ru, zh }

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
    breadcrumbs: config.breadcrumbs,
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
      ...(section.type === "custom"
        ? {}
        : { prefix: localizePath(section.prefix, language) }),
    })),
  })
}

function buildMessages(language: SiteLanguage, overrides: Language["messages"]) {
  const bundled = BUNDLED_MESSAGES[readPrimarySubtag(language.locale)]
  return Messages.parse({ ...bundled, ...overrides })
}
