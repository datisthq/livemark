import { textlane } from "textlane"
import * as html from "textlane/html"
import * as md from "textlane/md"

/** Render one line of Markdown, such as the site banner, as inline HTML */
export function renderInlineMarkdown(markdown: string, base: string | undefined) {
  const file = createInlineProcessor(base).processSync(markdown)
  return String(file.value)
    .replace(/<\/?p>/g, "")
    .trim()
}

function createInlineProcessor(base: string | undefined) {
  return textlane()
    .use(md.parse())
    .use(md.gfm())
    .use(md.pathRewrite({ base: base ?? null }))
    .use(md.toHtml())
    .use(html.externalLinks({ target: "_blank", rel: ["noopener", "noreferrer"] }))
    .use(html.stringify())
}
