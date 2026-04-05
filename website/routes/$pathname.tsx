import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { sortedArticles } from "../helpers/articles.ts"
import { Callout } from "../components/Callout.tsx"
import { Columns, Column } from "../components/Columns.tsx"
import { Card, Cards } from "../components/Cards.tsx"
import { CodeBlock } from "../components/CodeBlock.tsx"
import { headingComponents } from "../components/Heading.tsx"
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

export const Route = createFileRoute("/$pathname")({
  loader: ({ params }) => {
    const article = sortedArticles.find(a => a.pathname === params.pathname)
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
              }}
            />
          </div>
        </div>
        <Toc items={article.toc} />
      </div>
    </TocContext.Provider>
  )
}
