import { Link } from "@tanstack/react-router"
import { History } from "lucide-react"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import { Separator } from "../elements/separator.tsx"
import { TocContext } from "../helpers/toc-context.ts"
import { Footer } from "./Footer.tsx"
import { PageToolbar } from "./PageToolbar.tsx"
import { Toc } from "./Toc.tsx"

/** Auto-generated changelog index listing all versions by date */
export function ChangelogIndex(props: { sectionPrefix: string }) {
  const section = currentSection(props.sectionPrefix)
  const flat = sectionFlatArticles.get(props.sectionPrefix) ?? []
  const entries = flat
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)

  const tocItems = entries.map(entry => ({
    url: `#${slugOf(entry.path)}`,
    title: entry.title,
    depth: 2,
  }))

  const content = [
    `# ${section?.title ?? "Changelog"}`,
    ...entries.map(entry => {
      const parts = [`## ${entry.title}`]
      if (entry.date) parts.push(formatDate(entry.date))
      if (entry.description) parts.push("", entry.description)
      return parts.join("\n")
    }),
  ].join("\n\n")

  return (
    <TocContext.Provider value={tocItems}>
      <div className="flex flex-1 gap-10 p-6 md:p-10">
        <div className="flex-1 min-w-0 mx-auto max-w-3xl">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h1 id="top">
              <a href="#top">{section?.title ?? "Changelog"}</a>
            </h1>
            {entries[0]?.date && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground !-mt-4 !mb-0">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" />
                  Updated {formatDate(entries[0].date)}
                </span>
              </p>
            )}
          </div>
          <div className="space-y-6">
            {entries.map((entry, i) => (
              <article key={entry.path} id={slugOf(entry.path)}>
                {i > 0 && <Separator className="mb-6" />}
                <h2 className="text-2xl">
                  <Link
                    to="/$"
                    params={{ _splat: entry.path.replace(/^\/|\/$/g, "") }}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {entry.title}
                  </Link>
                </h2>
                {entry.date && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(entry.date)}
                  </p>
                )}
                {entry.description && (
                  <p className="text-muted-foreground mt-2">
                    {entry.description}
                  </p>
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
