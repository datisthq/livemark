import { z } from "zod"
import { Localized } from "./language.ts"

const schemas = createSectionSchemas(z.string())

/** Default section: renders articles. */
export type ArticleSection = z.infer<typeof ArticleSection>
export const ArticleSection = schemas.article

/** Blog section: date-sorted posts with tags and index. */
export type BlogSection = z.infer<typeof BlogSection>
export const BlogSection = schemas.blog

/** Changelog section: single file or GitHub releases, split per version. */
export type ChangelogSection = z.infer<typeof ChangelogSection>
export const ChangelogSection = schemas.changelog

/** Custom section: renders as a link to an arbitrary URL — absolute
 *  (`https://…`) or internal (`/changelog`). Internal URLs participate
 *  in active-state highlighting like routed sections. */
export type CustomSection = z.infer<typeof CustomSection>
export const CustomSection = schemas.custom

/**
 * A site section as the runtime sees it, its texts in one language. Discriminated on
 * `type`. When `type` is omitted, it defaults to "article" so plain `{ title, prefix }`
 * entries keep working.
 */
export type Section = z.infer<typeof Section>
export const Section = createSectionSchema(z.string())

/** A section as `livemark.config.ts` declares it: its texts may be {@link Localized}. */
export type UserSection = z.infer<typeof UserSection>
export const UserSection = createSectionSchema(Localized)

/** A section that owns a URL prefix — every type except `custom`. */
export type RoutedSection = Exclude<Section, CustomSection>

function createSectionSchema<T extends z.ZodType<Localized>>(text: T) {
  const variants = createSectionSchemas(text)
  return z.preprocess(
    input => {
      if (input === null || typeof input !== "object" || Array.isArray(input)) {
        return input
      }
      const record = input as Record<string, unknown>
      return "type" in record ? record : { ...record, type: "article" }
    },
    z.discriminatedUnion("type", [
      variants.article,
      variants.blog,
      variants.changelog,
      variants.custom,
    ]),
  )
}

function createSectionSchemas<T extends z.ZodType<Localized>>(text: T) {
  const BaseSection = z.strictObject({
    icon: z.string().optional(),
    title: text,
    position: z.enum(["header", "sidebar"]).default("header"),
    siteTitle: text.optional(),
    siteDescription: text.optional(),
    siteLink: z.string().optional(),
  })
  return {
    article: BaseSection.extend({ type: z.literal("article"), prefix: z.string() }),
    blog: BaseSection.extend({ type: z.literal("blog"), prefix: z.string() }),
    changelog: BaseSection.extend({
      type: z.literal("changelog"),
      prefix: z.string(),
      source: z.string(),
      version: z.boolean().optional(),
    }),
    custom: BaseSection.extend({ type: z.literal("custom"), url: z.string() }),
  }
}
