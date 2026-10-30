import { textlane } from "textlane"
import * as html from "textlane/html"
import * as md from "textlane/md"
import * as mdx from "textlane/mdx"
import type { Config } from "../../models/config.ts"
import { twoslashStage } from "../../plugins/twoslash.ts"

/** The frozen textlane processor an article compiles with: Markdown or MDX, with the
 *  twoslash stage only for articles that have a `twoslash` fence. */
export function createProcessor(props: {
  config: Config
  format: "md" | "mdx"
  twoslash: boolean
}) {
  const config = props.config
  const processor = textlane()
    .use(md.parse())
    .use(md.gfm())
    .use(md.gemoji())
    .use(md.definitionList())
    .use(md.math())
    .use(md.directive())
  if (props.format === "mdx") processor.use(md.mdx())
  processor
    .use(md.headingId({ attributes: true, markers: HEADING_MARKERS }))
    .use(md.packageCommand({ component: "PackageTabs" }))
    .use(md.component(COMPONENTS))
    .use(md.pathRewrite({ root: config.root, base: config.base, nodes: ["image"] }))
    .use(md.toHtml({ allowDangerousHtml: true, taskListLabels: TASK_LIST_LABELS }))
  // html.katex first, or display math is a `<pre><code>` html.highlight takes for code
  processor.use(html.katex()).use(
    html.highlight({
      themes: { light: config.codeThemeLight, dark: config.codeThemeDark },
      // a fence with no or an unknown language still gets padding, theme colors and
      // transformers
      defaultLanguage: "text",
      fallbackLanguage: "text",
      // catppuccin-latte's green sits at 3.2:1 on the code background, under WCAG AA
      colorReplacements: { "catppuccin-latte": { "#40a02b": "#2a7e16" } },
      addLanguageClass: true,
      metaProperty: "data-meta",
      inline: "tailing-curly-colon",
      transformers: [
        "notationDiff",
        "notationFocus",
        "notationHighlight",
        "notationErrorLevel",
        "metaHighlight",
        "metaWordHighlight",
      ],
    }),
  )
  // html.raw rebuilds every element and drops `data`, where code keeps its meta for
  // html.highlight
  if (props.format === "md") processor.use(html.raw({ passThrough: MDX_NODE_TYPES }))
  processor.use(html.unwrapImages())
  if (props.twoslash) processor.use(twoslashStage, { config })
  return processor
    .use(html.slug())
    .use(html.extractToc({ skip: ["data-step", "data-toc-hidden"] }))
    .use(mdx.compile({ outputFormat: "function-body" }))
    .freeze()
}

const HEADING_MARKERS = {
  "[step]": { "data-step": true },
  "[!toc]": { "data-toc-hidden": true },
  "[toc]": { hidden: true },
}

const TASK_LIST_LABELS = { checked: "Completed task", unchecked: "Task" }

// md.toHtml hands MDX nodes to hast, which html.raw must leave as they are
const MDX_NODE_TYPES = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
]

const CALLOUTS = ["note", "tip", "info", "warning", "danger"]

// Each livemark directive, alert and node as the component it renders
const COMPONENTS = {
  directives: [
    {
      name: CALLOUTS,
      kind: "container" as const,
      component: "Callout",
      nameAs: "type",
      labelAs: "title",
      attributes: [],
    },
    {
      name: "card",
      kind: "container" as const,
      component: "Card",
      attributes: [{ name: "title", default: "" }, "href", "icon"],
      group: { component: "Cards" },
    },
    {
      name: "column",
      kind: "container" as const,
      component: "Column",
      attributes: [],
      group: { component: "Columns" },
    },
    {
      name: "tab",
      kind: "container" as const,
      component: "ContentTab",
      attributes: [{ name: "title", default: "" }, "sync"],
      group: { component: "ContentTabs", min: 1, inherit: ["sync"] },
    },
    {
      name: "details",
      kind: "container" as const,
      component: "Details",
      labelAs: "summary",
      labelDefault: "Details",
      attributes: [],
    },
    {
      name: "filetree",
      kind: "container" as const,
      component: "FileTree",
      attributes: [],
      treeAs: "tree",
    },
    {
      name: "badge",
      kind: "text" as const,
      component: "InlineBadge",
      labelAs: "label",
      attributes: ["variant"],
    },
    {
      name: "button",
      kind: "leaf" as const,
      component: "LinkButton",
      labelAs: "label",
      attributes: ["href", "label", "variant", "size"],
      required: ["href", "label"],
    },
    {
      name: "icon",
      kind: "text" as const,
      component: "InlineIcon",
      attributes: ["name", "className"],
      required: ["name"],
    },
    {
      name: "abbr",
      kind: "text" as const,
      component: "Abbr",
      labelAs: "text",
      attributes: [{ name: "title", default: "" }],
    },
    {
      name: "toc",
      kind: "leaf" as const,
      component: "InlineToc",
      attributes: ["maxLevel"],
    },
    {
      name: "video",
      kind: "leaf" as const,
      where: { type: "youtube" },
      component: "YouTube",
      attributes: ["id"],
      required: ["id"],
    },
    {
      name: "audio",
      kind: "leaf" as const,
      where: { type: "soundcloud" },
      component: "SoundCloud",
      attributes: ["url"],
      required: ["url"],
    },
  ],
  alerts: {
    component: "Callout",
    typeAs: "type",
    types: {
      NOTE: "note",
      TIP: "tip",
      WARNING: "warning",
      CAUTION: "danger",
      IMPORTANT: "info",
    },
  },
  nodes: {
    defList: "DefinitionList",
    defListTerm: "DefinitionTerm",
    defListDescription: "DefinitionDetail",
  },
  codes: [
    { lang: "mermaid", component: "Mermaid" },
    { lang: "ansi", component: "AnsiCode" },
    { meta: "tab", group: { component: "CodeTabs", collect: "tabs", inherit: ["sync"] } },
  ],
  unknownDirectives: "source" as const,
}
