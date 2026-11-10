import type { ComponentType } from "react"
import { TocContext } from "../helpers/toc-context.ts"
import type { TocItem } from "../models/toc.ts"
import { Abbr } from "./Abbr.tsx"
import { AnsiCode } from "./AnsiCode.tsx"
import { Audio } from "./Audio.tsx"
import { Badge } from "./Badge.tsx"
import { Button } from "./Button.tsx"
import { Callout } from "./Callout.tsx"
import { Card } from "./Card.tsx"
import { Cards } from "./Cards.tsx"
import { CodeBlock } from "./CodeBlock.tsx"
import { CodeTabs } from "./CodeTabs.tsx"
import { Column } from "./Column.tsx"
import { Columns } from "./Columns.tsx"
import { DefinitionDetail, DefinitionList, DefinitionTerm } from "./DefinitionList.tsx"
import { Details } from "./Details.tsx"
import { Filetree } from "./Filetree.tsx"
import { FootnoteRef } from "./FootnoteRef.tsx"
import { headingComponents } from "./Heading.tsx"
import { Icon } from "./Icon.tsx"
import { Mermaid } from "./Mermaid.tsx"
import { PackageTabs } from "./PackageTabs.tsx"
import {
  SortableTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./SortableTable.tsx"
import { Tab } from "./Tab.tsx"
import { Tabs } from "./Tabs.tsx"
import { Toc } from "./Toc.tsx"
import { Video } from "./Video.tsx"
import { ZoomImage } from "./ZoomImage.tsx"
import { Separator } from "../elements/separator.tsx"

type MarkdownComponents = Record<string, ComponentType<never>>

/** Renders compiled Markdown with Livemark's components for its HTML elements,
 *  directives and code blocks; `components` adds or replaces any of them. */
export function Markdown(props: {
  component: ComponentType<{ components?: object }>
  toc?: TocItem[]
  components?: MarkdownComponents
}) {
  const Content = props.component
  const content = <Content components={{ ...COMPONENTS, ...props.components }} />
  if (!props.toc) return content
  return <TocContext.Provider value={props.toc}>{content}</TocContext.Provider>
}

const COMPONENTS = {
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
  Audio,
  Badge,
  Button,
  Callout,
  Card,
  Cards,
  Column,
  Columns,
  CodeTabs,
  DefinitionDetail,
  DefinitionList,
  DefinitionTerm,
  Details,
  Filetree,
  Icon,
  Mermaid,
  PackageTabs,
  Tab,
  Tabs,
  Toc,
  Video,
  ...headingComponents,
}
