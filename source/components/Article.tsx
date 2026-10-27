import { useRef } from "react"
import { MDXContent } from "@content-collections/mdx/react"
import { Calendar, History, User } from "lucide-react"
import type { ArticleView } from "../models/article.ts"
import { formatShortDate } from "../helpers/date.ts"
import { useSearchHighlight } from "../helpers/search-highlight.ts"
import { TocContext } from "../helpers/toc-context.ts"
import { Abbr } from "./Abbr.tsx"
import { AnsiCode } from "./AnsiCode.tsx"
import { Breadcrumbs } from "./Breadcrumbs.tsx"
import { Callout } from "./Callout.tsx"
import { Card } from "./Card.tsx"
import { Cards } from "./Cards.tsx"
import { CodeBlock } from "./CodeBlock.tsx"
import { CodeTabs } from "./CodeTabs.tsx"
import { Column } from "./Column.tsx"
import { Columns } from "./Columns.tsx"
import { ContentTab } from "./ContentTab.tsx"
import { ContentTabs } from "./ContentTabs.tsx"
import { DefinitionDetail, DefinitionList, DefinitionTerm } from "./DefinitionList.tsx"
import { Details } from "./Details.tsx"
import { FileTree } from "./FileTree.tsx"
import { Footer } from "./Footer.tsx"
import { FootnoteRef } from "./FootnoteRef.tsx"
import { headingComponents } from "./Heading.tsx"
import { InlineBadge } from "./InlineBadge.tsx"
import { InlineIcon } from "./InlineIcon.tsx"
import { InlineToc } from "./InlineToc.tsx"
import { LinkButton } from "./LinkButton.tsx"
import { Mermaid } from "./Mermaid.tsx"
import { PackageTabs } from "./PackageTabs.tsx"
import { PageToolbar } from "./PageToolbar.tsx"
import { PrevNext } from "./PrevNext.tsx"
import {
  SortableTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./SortableTable.tsx"
import { SoundCloud } from "./SoundCloud.tsx"
import { MobileToc, Toc } from "./Toc.tsx"
import { YouTube } from "./YouTube.tsx"
import { ZoomImage } from "./ZoomImage.tsx"
import { Separator } from "../elements/separator.tsx"
import { useMessages, useSite } from "../hooks/site.ts"

/** Full-page article layout: MDX content, table of contents, toolbar, prev/next, footer */
export function Article(props: { article: ArticleView; highlight?: string }) {
  const { article } = props
  const prose = useRef<HTMLDivElement>(null)
  useSearchHighlight(prose, article.path, props.highlight)
  const site = useSite()
  const t = useMessages()
  const formatDate = (iso?: string) =>
    iso ? formatShortDate(iso, site.language.locale) : undefined
  const lastUpdated = formatDate(article.lastUpdated)
  const publishedDate = formatDate(article.date)
  const authors = article.author
    ? Array.isArray(article.author)
      ? article.author
      : [article.author]
    : []
  const hasMeta = publishedDate || authors.length > 0 || lastUpdated
  const breadcrumbs = article.breadcrumbs ?? site.config.breadcrumbs ?? true

  return (
    <TocContext.Provider value={article.tocItems}>
      {article.toc !== false && (
        <MobileToc items={article.tocItems} title={article.title}>
          <PageToolbar
            sourceUrl={article.sourceUrl}
            sourceAction={article.sourceAction}
            content={article.content}
          />
        </MobileToc>
      )}
      <div className="flex flex-1 gap-10 p-4 pt-8 md:p-10">
        <div className="flex-1 min-w-0 mx-auto max-w-3xl sidebar-collapsed:max-w-none">
          {breadcrumbs && <Breadcrumbs path={article.path} title={article.title} />}
          <div
            ref={prose}
            lang={article.contentLanguage}
            className="prose dark:prose-invert max-w-none"
          >
            <h1 id="top">
              <a href="#top">{article.title}</a>
            </h1>
            {hasMeta && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground !-mt-4 !mb-6">
                {authors.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {authors.join(", ")}
                  </span>
                )}
                {publishedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {t("page.published", { date: publishedDate })}
                  </span>
                )}
                {lastUpdated && (
                  <span className="flex items-center gap-1.5">
                    <History className="size-3.5" />
                    {t("page.updated", { date: lastUpdated })}
                  </span>
                )}
              </p>
            )}
            {article.image && (
              <img
                src={article.image}
                alt=""
                className="!mt-0 !mb-6 w-full rounded-card border shadow-sm"
              />
            )}
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
          <PrevNext path={article.path} />
          <Footer />
        </div>
        {article.toc !== false && (
          <Toc items={article.tocItems}>
            <PageToolbar
              sourceUrl={article.sourceUrl}
              sourceAction={article.sourceAction}
              content={article.content}
            />
          </Toc>
        )}
      </div>
    </TocContext.Provider>
  )
}
