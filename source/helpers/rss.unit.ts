import { describe, expect, it } from "vite-plus/test"
import { renderRssFeed } from "./rss.ts"

describe("renderRssFeed", () => {
  it("renders a minimal channel with no items", () => {
    const xml = renderRssFeed({
      title: "Blog",
      description: "Latest posts",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [],
    })
    expect(xml).toBe(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog</title>
    <link>https://example.com/blog/</link>
    <description>Latest posts</description>
    <atom:link href="https://example.com/blog/rss.xml" rel="self" type="application/rss+xml" />
  </channel>
</rss>
`,
    )
  })

  it("renders an item with all optional fields", () => {
    const xml = renderRssFeed({
      title: "Blog",
      description: "Latest posts",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [
        {
          title: "Hello",
          link: "https://example.com/blog/hello/",
          guid: "https://example.com/blog/hello/",
          description: "First post",
          pubDate: "2026-05-16T00:00:00Z",
          author: "Jane",
          categories: ["news"],
        },
      ],
    })
    expect(xml).toContain("<title>Hello</title>")
    expect(xml).toContain("<link>https://example.com/blog/hello/</link>")
    expect(xml).toContain(
      '<guid isPermaLink="true">https://example.com/blog/hello/</guid>',
    )
    expect(xml).toContain("<description>First post</description>")
    expect(xml).toContain("<pubDate>Sat, 16 May 2026 00:00:00 GMT</pubDate>")
    expect(xml).toContain("<author>Jane</author>")
    expect(xml).toContain("<category>news</category>")
  })

  it("joins array authors with a comma", () => {
    const xml = renderRssFeed({
      title: "Blog",
      description: "",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [
        {
          title: "x",
          link: "https://example.com/blog/x/",
          guid: "https://example.com/blog/x/",
          author: ["Alice", "Bob"],
        },
      ],
    })
    expect(xml).toContain("<author>Alice, Bob</author>")
  })

  it("emits one <category> per tag", () => {
    const xml = renderRssFeed({
      title: "Blog",
      description: "",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [
        {
          title: "x",
          link: "https://example.com/blog/x/",
          guid: "https://example.com/blog/x/",
          categories: ["a", "b", "c"],
        },
      ],
    })
    expect(xml).toContain("<category>a</category>")
    expect(xml).toContain("<category>b</category>")
    expect(xml).toContain("<category>c</category>")
  })

  it("escapes XML metacharacters in text content", () => {
    const xml = renderRssFeed({
      title: 'Title & "quoted" <tag>',
      description: "A & B",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [
        {
          title: "1 < 2 & 3 > 0",
          link: "https://example.com/blog/x/",
          guid: "https://example.com/blog/x/",
          description: "It's fine",
        },
      ],
    })
    expect(xml).toContain(
      "<title>Title &amp; &quot;quoted&quot; &lt;tag&gt;</title>",
    )
    expect(xml).toContain("<description>A &amp; B</description>")
    expect(xml).toContain("<title>1 &lt; 2 &amp; 3 &gt; 0</title>")
    expect(xml).toContain("<description>It&apos;s fine</description>")
  })

  it("leaves an unparsable pubDate unchanged", () => {
    const xml = renderRssFeed({
      title: "Blog",
      description: "",
      link: "https://example.com/blog/",
      feedLink: "https://example.com/blog/rss.xml",
      items: [
        {
          title: "x",
          link: "https://example.com/blog/x/",
          guid: "https://example.com/blog/x/",
          pubDate: "not-a-date",
        },
      ],
    })
    expect(xml).toContain("<pubDate>not-a-date</pubDate>")
  })
})
