export interface RssItem {
  title: string
  link: string
  guid: string
  description?: string
  pubDate?: string
  author?: string | string[]
  categories?: string[]
}

export interface RssFeed {
  title: string
  description: string
  link: string
  feedLink: string
  items: RssItem[]
}

/** Render an RSS 2.0 channel as a serialized XML document. Pure — all I/O,
 *  URL composition, and item-count limits live in the caller. `pubDate` is
 *  accepted as an ISO string (article frontmatter shape) and converted to
 *  RFC 822 here, which is what readers like NetNewsWire and Feedly parse. */
export function renderRssFeed(feed: RssFeed) {
  const lines: string[] = []
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
  lines.push("  <channel>")
  lines.push(`    <title>${escapeXml(feed.title)}</title>`)
  lines.push(`    <link>${escapeXml(feed.link)}</link>`)
  lines.push(`    <description>${escapeXml(feed.description)}</description>`)
  lines.push(
    `    <atom:link href="${escapeXml(feed.feedLink)}" rel="self" type="application/rss+xml" />`,
  )
  for (const item of feed.items) {
    lines.push("    <item>")
    lines.push(`      <title>${escapeXml(item.title)}</title>`)
    lines.push(`      <link>${escapeXml(item.link)}</link>`)
    lines.push(`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`)
    if (item.description) {
      lines.push(
        `      <description>${escapeXml(item.description)}</description>`,
      )
    }
    if (item.pubDate) {
      lines.push(
        `      <pubDate>${escapeXml(toRfc822(item.pubDate))}</pubDate>`,
      )
    }
    if (item.author) {
      const author = Array.isArray(item.author)
        ? item.author.join(", ")
        : item.author
      lines.push(`      <author>${escapeXml(author)}</author>`)
    }
    if (item.categories) {
      for (const category of item.categories) {
        lines.push(`      <category>${escapeXml(category)}</category>`)
      }
    }
    lines.push("    </item>")
  }
  lines.push("  </channel>")
  lines.push("</rss>")
  return `${lines.join("\n")}\n`
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toRfc822(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toUTCString()
}
