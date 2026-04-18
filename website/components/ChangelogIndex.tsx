import { Link } from "@tanstack/react-router"
import {
  currentSection,
  sectionFlatArticles,
  sortedArticles,
} from "../content/article.ts"
import { Separator } from "../elements/separator.tsx"
import { Footer } from "./Footer.tsx"

/** Auto-generated changelog index listing all versions by date */
export function ChangelogIndex(props: { sectionPrefix: string }) {
  const section = currentSection(props.sectionPrefix)
  const flat = sectionFlatArticles.get(props.sectionPrefix) ?? []
  const entries = flat
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)

  return (
    <div className="flex flex-1 p-6 md:p-10">
      <div className="flex-1 min-w-0 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          {section?.title ?? "Changelog"}
        </h1>
        <div className="space-y-6">
          {entries.map((entry, i) => (
            <div key={entry.path}>
              {i > 0 && <Separator className="mb-6" />}
              <Link
                to="/$"
                params={{ _splat: entry.path.replace(/^\/|\/$/g, "") }}
                className="block group"
              >
                <article>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {entry.title}
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
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
