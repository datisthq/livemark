import { z } from "zod"

const BaseSection = z.object({
  icon: z.string().optional(),
  title: z.string(),
  position: z.enum(["header", "sidebar"]).default("header"),
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

/** External section: renders as a link to an arbitrary URL. */
export type ExternalSection = z.infer<typeof ExternalSection>
export const ExternalSection = BaseSection.extend({
  type: z.literal("external"),
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
    ExternalSection,
  ]),
)
