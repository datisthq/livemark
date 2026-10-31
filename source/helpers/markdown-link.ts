/** The URL a relative link to a Markdown file points at, as on GitHub: the article
 *  built from that file, in the reader's language when it is translated. Undefined
 *  when the href is not such a link or no article comes from the file. */
export function resolveMarkdownLink(props: {
  href: string
  file: string
  language: string
  articles: { file?: string; key: string; language: string; path: string }[]
}) {
  const match = MARKDOWN_HREF.exec(props.href)
  if (!match?.[1]) return undefined
  // URL resolution, not node:path, which the browser bundle lacks
  const url = new URL(match[1], `file:///${props.file}`)
  const target = decodeURIComponent(url.pathname.slice(1))
  const article = props.articles.find(a => a.file === target)
  if (!article) return undefined
  const translated = props.articles.find(
    a => a.key === article.key && a.language === props.language,
  )
  return (translated ?? article).path + (match[2] ?? "")
}

// Relative only: no scheme, no leading "/" and not a bare fragment
const MARKDOWN_HREF = /^(?![a-z][a-z\d+.-]*:|[/#])([^?#]+\.mdx?)(#.*)?$/i
