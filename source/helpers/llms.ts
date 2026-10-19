import type { Config } from "../models/config.ts"
import type { RoutedSection } from "../models/section.ts"
import {
  buildArticleTree,
  compareArticleDate,
  compareArticleOrder,
  flattenArticleTree,
} from "./article.ts"
import { partitionBySection } from "./section.ts"

/** The slice of a built article that agent-facing files are rendered from. */
export interface LlmsArticle {
  path: string
  title: string
  description?: string
  order?: number
  date?: string
}

/** Render `llms.txt`: the site title and description, then one Markdown link
 *  per article twin, grouped under each routed section in sidebar order. */
export function renderLlmsText(props: {
  config: Pick<Config, "title" | "description" | "site" | "base" | "sections">
  articles: LlmsArticle[]
}) {
  const config = props.config
  const sections =
    config.sections?.filter((s): s is RoutedSection => s.type !== "custom") ?? []
  const buckets = partitionBySection(
    [...props.articles].sort(compareArticleOrder),
    sections,
  )
  const groups = [
    ...sections.map(s => ({ section: s, title: s.title })),
    { section: undefined, title: sections.length ? "Other" : "Pages" },
  ]

  const lines = [`# ${config.title}`, "", `> ${config.description}`]
  for (const group of groups) {
    const bucket = buckets.get(group.section?.prefix ?? "__default__")
    if (!bucket?.length) continue
    const dated = group.section?.type === "blog" || group.section?.type === "changelog"
    const ordered = dated
      ? [...bucket].sort(compareArticleDate)
      : flattenArticleTree(buildArticleTree(bucket)).flatMap(
          path => bucket.find(a => a.path === path) ?? [],
        )
    lines.push("", `## ${group.title}`, "")
    for (const article of ordered) {
      const link = `[${article.title}](${buildTwinUrl(config, article.path)})`
      lines.push(article.description ? `- ${link}: ${article.description}` : `- ${link}`)
    }
  }
  return `${lines.join("\n")}\n`
}

/** Render the Markdown twin of an article: its title and description as the
 *  rendered page shows them, then the body without its own leading h1. */
export function renderMarkdownTwin(props: { article: LlmsArticle; content: string }) {
  const article = props.article
  const parts = [`# ${article.title}`]
  if (article.description) parts.push(`> ${article.description}`)
  parts.push(stripLeadingH1(props.content).trim())
  return `${parts.join("\n\n")}\n`
}

/** Path of an article's Markdown twin inside the build output (no base). */
export function buildTwinFileName(path: string) {
  return `${path.replace(/^\//, "")}index.md`
}

/** Drop a leading h1 so a title set by frontmatter or a patch is not shown twice */
export function stripLeadingH1(content: string) {
  return content.replace(/^[ \t]*#\s+[^\n]*\n+/, "")
}

function buildTwinUrl(config: Pick<Config, "site" | "base">, path: string) {
  const host = config.site?.replace(/\/+$/, "") ?? ""
  return `${host}${config.base ?? ""}${path}index.md`
}
