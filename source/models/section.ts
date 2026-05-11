import { z } from "zod"

const BaseSection = z.object({
  icon: z.string().optional(),
  title: z.string(),
  position: z.enum(["header", "sidebar"]).default("header"),
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  siteLink: z.string().optional(),
})

/** Default section: renders articles. */
export type ArticleSection = z.infer<typeof ArticleSection>
export const ArticleSection = BaseSection.extend({
  type: z.literal("article"),
  prefix: z.string(),
})

/** Blog section: date-sorted posts with tags and index. */
export type BlogSection = z.infer<typeof BlogSection>
export const BlogSection = BaseSection.extend({
  type: z.literal("blog"),
  prefix: z.string(),
})

/** Changelog section: single file or GitHub releases, split per version. */
export type ChangelogSection = z.infer<typeof ChangelogSection>
export const ChangelogSection = BaseSection.extend({
  type: z.literal("changelog"),
  prefix: z.string(),
  source: z.string(),
  version: z.boolean().optional(),
})

/** Custom section: renders as a link to an arbitrary URL — absolute
 *  (`https://…`) or internal (`/changelog`). Internal URLs participate
 *  in active-state highlighting like routed sections. */
export type CustomSection = z.infer<typeof CustomSection>
export const CustomSection = BaseSection.extend({
  type: z.literal("custom"),
  url: z.string(),
})

/**
 * A site section. Discriminated on `type`.
 * When `type` is omitted, it defaults to "article" so plain
 * `{ title, prefix }` entries keep working.
 */
export type Section = z.infer<typeof Section>
export const Section = z.preprocess(
  input => {
    if (input === null || typeof input !== "object" || Array.isArray(input)) {
      return input
    }
    const record = input as Record<string, unknown>
    return "type" in record ? record : { ...record, type: "article" }
  },
  z.discriminatedUnion("type", [
    ArticleSection,
    BlogSection,
    ChangelogSection,
    CustomSection,
  ]),
)
