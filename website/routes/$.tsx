import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { sortedArticles } from "../content/article.ts"
import { Callout } from "../components/Callout.tsx"
import { Columns, Column } from "../components/Columns.tsx"
import { Card, Cards } from "../components/Cards.tsx"
import { CodeBlock } from "../components/CodeBlock.tsx"
import { headingComponents } from "../components/Heading.tsx"
import { Calendar } from "lucide-react"
import { CodeTabs } from "../components/CodeTabs.tsx"
import { ContentTab } from "../components/ContentTab.tsx"
import { ContentTabs } from "../components/ContentTabs.tsx"
import { Details } from "../components/Details.tsx"
import { FileTree } from "../components/FileTree.tsx"
import { InlineIcon } from "../components/InlineIcon.tsx"
import { Abbr } from "../components/Abbr.tsx"
import { FootnoteRef } from "../components/FootnoteRef.tsx"
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDetail,
} from "../components/DefinitionList.tsx"
import { AnsiCode } from "../components/AnsiCode.tsx"
import { InlineBadge } from "../components/InlineBadge.tsx"
import { LinkButton } from "../components/LinkButton.tsx"
import { Mermaid } from "../components/Mermaid.tsx"
import { PackageTabs } from "../components/PackageTabs.tsx"
import { SoundCloud } from "../components/SoundCloud.tsx"
import { YouTube } from "../components/YouTube.tsx"
import { InlineToc } from "../components/InlineToc.tsx"
import { PageToolbar } from "../components/PageToolbar.tsx"
import { Footer } from "../components/Footer.tsx"
import { PrevNext } from "../components/PrevNext.tsx"
import { Toc } from "../components/Toc.tsx"
import { ZoomImage } from "../components/ZoomImage.tsx"
import { Separator } from "../elements/separator.tsx"
import { TocContext } from "../helpers/toc-context.ts"
import {
  SortableTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/SortableTable.tsx"

export const Route = createFileRoute("/$")({
  loader: ({ params }) => {
    const splat = `/${params._splat}/`
    const article = sortedArticles.find(a => a.pathname === splat)
    if (!article) throw notFound()
    return article
  },
  head: ({ loaderData }) => ({
    meta: [
      ...(loaderData ? [{ title: loaderData.title }] : []),
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
  }),
  component: Component,
})

function Component() {
  const article = Route.useLoaderData()
  const lastUpdated = formatDate(article.lastUpdated)

  const H1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <>
      <h1 {...props}>
        {props.id ? (
          <a href={`#${props.id}`}>{props.children}</a>
        ) : (
          props.children
        )}
      </h1>
      {lastUpdated && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground !-mt-4 !mb-6">
          <Calendar className="size-3.5" />
          Last updated {lastUpdated}
        </p>
      )}
    </>
  )

  return (
    <TocContext.Provider value={article.toc}>
      <div className="flex flex-1 gap-10 p-6 md:p-10">
        <div className="flex-1 min-w-0 mx-auto max-w-3xl">
          <div className="prose dark:prose-invert max-w-none">
            <MDXContent
              code={article.mdx}
              components={{
                hr: Separator,
                img: ZoomImage,
                pre: CodeBlock,
                table: SortableTable,
                thead: TableHeader,
                tbody: TableBody,
                tr: TableRow,
                th: TableHead,
                td: TableCell,
                a: FootnoteRef,
                Abbr,
                AnsiCode,
                Callout,
                Card,
                Cards,
                Column,
                Columns,
                CodeTabs,
                ContentTab,
                ContentTabs,
                DefinitionDetail,
                DefinitionList,
                DefinitionTerm,
                Details,
                FileTree,
                InlineBadge,
                InlineIcon,
                InlineToc,
                LinkButton,
                Mermaid,
                PackageTabs,
                SoundCloud,
                YouTube,
                ...headingComponents,
                h1: H1,
              }}
            />
          </div>
          <PrevNext pathname={article.pathname} />
          <Footer />
        </div>
        <Toc items={article.toc}>
          <PageToolbar filePath={article.filePath} content={article.content} />
        </Toc>
      </div>
    </TocContext.Provider>
  )
}

function formatDate(iso?: string) {
  if (!iso) return undefined
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
