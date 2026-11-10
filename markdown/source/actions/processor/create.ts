import { textlane } from "textlane"
import * as html from "textlane/html"
import * as md from "textlane/md"
import * as mdx from "textlane/mdx"
import type { MarkdownPlugins } from "../../models/plugins.ts"
import { twoslashStage } from "../../plugins/twoslash.ts"

/** The frozen textlane processor Markdown compiles with: Markdown or MDX, with the
 *  twoslash stage only for documents that have a `twoslash` fence, and the `plugins`
 *  in their two slots. */
export function createProcessor(props: {
  format: "md" | "mdx"
  twoslash: boolean
  outputFormat: "program" | "function-body"
  allowDangerousHtml: boolean
  codeThemeLight: string
  codeThemeDark: string
  plugins?: MarkdownPlugins
  root?: string
  base?: string
}) {
  const themes = { light: props.codeThemeLight, dark: props.codeThemeDark }
  const processor = textlane()
    .use(md.parse())
    .use(md.gfm())
    .use(md.gemoji())
    .use(md.definitionList())
    .use(md.math())
    .use(md.directive())
  if (props.format === "mdx") processor.use(md.mdx())
  // Before md.component, which renders an unknown directive as its source text
  processor
    .use(props.plugins?.md ?? [])
    .use(md.headingId({ attributes: true, markers: HEADING_MARKERS }))
    .use(md.packageCommand({ component: "PackageTabs" }))
    .use(md.component(COMPONENTS))
  if (props.root !== undefined) {
    processor.use(
      md.pathRewrite({ root: props.root, base: props.base, nodes: ["image"] }),
    )
  }
  processor.use(
    md.toHtml({
      allowDangerousHtml: props.allowDangerousHtml,
      taskListLabels: TASK_LIST_LABELS,
    }),
  )
  // html.katex first, or display math is a `<pre><code>` html.highlight takes for code
  processor.use(html.katex()).use(
    html.highlight({
      themes,
      // a fence with no or an unknown language still gets padding, theme colors and
      // transformers
      defaultLanguage: "text",
      fallbackLanguage: "text",
      // catppuccin-latte's green (3.2:1) and comment grey (3.8:1) sit under WCAG AA on
      // the code background
      colorReplacements: {
        "catppuccin-latte": { "#40a02b": "#2a7e16", "#7c7f93": "#6c6f85" },
      },
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
  // Without allowDangerousHtml md.toHtml has dropped raw HTML, which html.raw would parse
  if (props.format === "md" && props.allowDangerousHtml) {
    processor.use(html.raw({ passThrough: MDX_NODE_TYPES }))
  }
  processor.use(html.unwrapImages())
  if (props.twoslash) processor.use(twoslashStage, { themes })
  return processor
    .use(props.plugins?.html ?? [])
    .use(html.slug())
    .use(html.extractToc({ skip: ["data-step", "data-toc-hidden"] }))
    .use(mdx.compile({ outputFormat: props.outputFormat }))
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
      component: "Tab",
      attributes: [{ name: "title", default: "" }, "sync"],
      group: { component: "Tabs", min: 1, inherit: ["sync"] },
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
      component: "Filetree",
      attributes: [],
      treeAs: "tree",
    },
    {
      name: "badge",
      kind: "text" as const,
      component: "Badge",
      labelAs: "label",
      attributes: ["variant"],
    },
    {
      name: "button",
      kind: "leaf" as const,
      component: "Button",
      labelAs: "label",
      attributes: ["href", "label", "variant", "size"],
      required: ["href", "label"],
    },
    {
      name: "icon",
      kind: "text" as const,
      component: "Icon",
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
      component: "Toc",
      attributes: ["maxLevel"],
    },
    {
      name: "video",
      kind: "leaf" as const,
      where: { type: "youtube" },
      component: "Video",
      attributes: ["url"],
      required: ["url"],
    },
    {
      name: "audio",
      kind: "leaf" as const,
      where: { type: "soundcloud" },
      component: "Audio",
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

/** Every directive name an article may use; any other renders as its source text. */
export const DIRECTIVE_NAMES = new Set(
  COMPONENTS.directives.flatMap(directive => directive.name),
)
