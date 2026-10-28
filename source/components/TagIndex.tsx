import { Link } from "@tanstack/react-router"
import { History } from "lucide-react"
import { sortedArticles } from "../content/article.ts"
import { sectionTags } from "../content/tag.ts"
import { Separator } from "../elements/separator.tsx"
import { formatShortDate } from "../helpers/date.ts"
import { TocContext } from "../helpers/toc-context.ts"
import { Footer } from "./Footer.tsx"
import { PageToolbar } from "./PageToolbar.tsx"
import { MobileToc, Toc } from "./Toc.tsx"
import { useMessages, useSite } from "../hooks/site.ts"
import { buildPathLink } from "../helpers/path-link.ts"

/** Blog tag page listing posts filtered by a specific tag */
export function TagIndex(props: { sectionPrefix: string; tag: string }) {
  const tagMap = sectionTags.get(props.sectionPrefix)
  const paths = tagMap?.get(props.tag) ?? []
  const posts = paths
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)

  const tocItems = posts.map(post => ({
    url: `#${slugOf(post.path)}`,
    title: post.title,
    depth: 2,
  }))

  const site = useSite()
  const t = useMessages()
  const formatDate = (iso: string) => formatShortDate(iso, site.language.locale)
  const title = t("blog.tagged", { tag: props.tag })

  const content = [
    `# ${title}`,
    ...posts.map(post => {
      const parts = [`## ${post.title}`]
      if (post.date) parts.push(formatDate(post.date))
      if (post.author) {
        parts.push(Array.isArray(post.author) ? post.author.join(", ") : post.author)
      }
      if (post.description) parts.push("", post.description)
      return parts.join("\n")
    }),
  ].join("\n\n")

  return (
    <TocContext.Provider value={tocItems}>
      <MobileToc items={tocItems} title={title}>
        <PageToolbar content={content} />
      </MobileToc>
      <div className="flex flex-1 gap-10 p-4 pt-8 md:p-10 lg:pl-22">
        <div className="flex-1 min-w-0 mx-auto max-w-3xl lg:mx-0 sidebar-collapsed:max-w-none">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h1 id="top">
              <a href="#top">Posts tagged &lsquo;{props.tag}&rsquo;</a>
            </h1>
            {posts[0]?.date && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground !-mt-4 !mb-0">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" />
                  {t("page.updated", { date: formatDate(posts[0].date) })}
                </span>
              </p>
            )}
          </div>
          <div className="space-y-6">
            {posts.map((post, i) => (
              <article key={post.path} id={slugOf(post.path)}>
                {i > 0 && <Separator className="mb-6" />}
                <h2 className="text-2xl">
                  <Link
                    {...buildPathLink(post.path)}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex gap-3">
                  {post.date && <span>{formatDate(post.date)}</span>}
                  {post.author && (
                    <span>
                      {Array.isArray(post.author) ? post.author.join(", ") : post.author}
                    </span>
                  )}
                </p>
                {post.description && (
                  <p className="text-muted-foreground mt-2">{post.description}</p>
                )}
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Footer />
          </div>
        </div>
        <Toc items={tocItems}>
          <PageToolbar content={content} />
        </Toc>
      </div>
    </TocContext.Provider>
  )
}

function slugOf(path: string) {
  return (
    path
      .replace(/^\/|\/$/g, "")
      .split("/")
      .pop() ?? ""
  )
}
