import { Link } from "@tanstack/react-router"
import { sortedArticles } from "../content/article.ts"
import { sectionTags } from "../content/tag.ts"
import { Separator } from "../elements/separator.tsx"
import { Footer } from "./Footer.tsx"

/** Blog tag page listing posts filtered by a specific tag */
export function TagIndex(props: { sectionPrefix: string; tag: string }) {
  const tagMap = sectionTags.get(props.sectionPrefix)
  const paths = tagMap?.get(props.tag) ?? []
  const posts = paths
    .map(p => sortedArticles.find(a => a.path === p))
    .filter(a => a !== undefined)

  return (
    <div className="flex flex-1 p-6 md:p-10">
      <div className="flex-1 min-w-0 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Posts tagged &lsquo;{props.tag}&rsquo;
        </h1>
        <div className="space-y-6">
          {posts.map((post, i) => (
            <div key={post.path}>
              {i > 0 && <Separator className="mb-6" />}
              <Link
                to="/$"
                params={{ _splat: post.path.replace(/^\/|\/$/g, "") }}
                className="block group"
              >
                <article>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 flex gap-3">
                    {post.date && <span>{formatDate(post.date)}</span>}
                    {post.author && (
                      <span>
                        {Array.isArray(post.author)
                          ? post.author.join(", ")
                          : post.author}
                      </span>
                    )}
                  </p>
                  {post.description && (
                    <p className="text-muted-foreground mt-2">
                      {post.description}
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
