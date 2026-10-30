import { Worker } from "node:worker_threads"
import type { Element, ElementContent, Root } from "hast"
import { toString } from "hast-util-to-string"
import { visit } from "unist-util-visit"
import type { Config } from "../models/config.ts"

const TWOSLASH = /(?:^|\s)twoslash(?:\s|$)/

/** Re-highlight the code blocks whose meta names `twoslash` with Shiki's twoslash
 *  transformer: the one stage textlane cannot run natively, as it needs TypeScript. */
export function twoslashStage(options: { config: Config }) {
  return async (tree: Root) => {
    const blocks: { node: Element; meta: string; lang: string }[] = []
    visit(tree, "element", node => {
      if (node.tagName !== "pre") return
      const meta = node.properties["data-meta"] ?? node.properties.dataMeta
      if (typeof meta !== "string" || !TWOSLASH.test(meta)) return
      blocks.push({ node, meta, lang: readLanguage(node) })
    })
    const themes = {
      light: options.config.codeThemeLight,
      dark: options.config.codeThemeDark,
    }
    await Promise.all(
      blocks.map(async block => {
        const pre = await renderBlock({ ...block, code: toString(block.node), themes })
        if (!pre) return
        block.node.properties = structuredClone(pre.properties)
        block.node.children = structuredClone(pre.children) as ElementContent[]
      }),
    )
  }
}

/** Start TypeScript in the twoslash worker now, so it is ready once a block needs it */
export function warmTwoslash() {
  readWorker()
}

interface BlockRequest {
  code: string
  lang: string
  meta: string
  themes: { light: string; dark: string }
}

// Translated pages repeat the same blocks, which twoslash would check again
const rendered = new Map<string, Promise<Element | undefined>>()

function renderBlock(request: BlockRequest) {
  const key = JSON.stringify([request.lang, request.meta, request.themes, request.code])
  let pre = rendered.get(key)
  if (!pre) {
    pre = callWorker(request)
    rendered.set(key, pre)
  }
  return pre
}

interface Pending {
  resolve: (pre: Element | undefined) => void
  reject: (error: Error) => void
}

// TypeScript takes ~0.8 s to start on the thread twoslash runs on; a worker keeps it
// off the main thread, where textlane compiles every other article meanwhile
let worker: { thread: Worker; pending: Map<number, Pending>; next: number } | undefined

function readWorker() {
  if (worker) return worker
  const thread = new Worker(WORKER_SOURCE, {
    eval: true,
    // an eval'd worker resolves bare specifiers from the cwd, so it imports the
    // packages this module resolves rather than resolving them itself
    workerData: {
      shiki: import.meta.resolve("shiki"),
      twoslash: import.meta.resolve("@shikijs/twoslash"),
    },
  })
  const pending = new Map<number, Pending>()
  thread.on("message", (message: { id: number; pre?: Element; error?: string }) => {
    const call = pending.get(message.id)
    pending.delete(message.id)
    if (pending.size === 0) thread.unref()
    if (message.error) call?.reject(new Error(message.error))
    else call?.resolve(message.pre)
  })
  thread.on("error", error => {
    for (const call of pending.values()) call.reject(error)
    pending.clear()
    worker = undefined
  })
  // Only a worker with blocks in flight keeps the build alive; `on("message")` refs it
  thread.unref()
  worker = { thread, pending, next: 0 }
  return worker
}

function callWorker(request: BlockRequest) {
  const current = readWorker()
  const id = current.next++
  return new Promise<Element | undefined>((resolve, reject) => {
    current.pending.set(id, { resolve, reject })
    current.thread.ref()
    current.thread.postMessage({ id, ...request })
  })
}

// The first twoslash call builds TypeScript's program over `lib.*.d.ts`; one throwaway
// block pays that while the main thread still has other articles to compile
const WORKER_SOURCE = `
const { parentPort, workerData } = require("node:worker_threads")
const ready = (async () => {
  const { bundledLanguages, getSingletonHighlighter } = await import(workerData.shiki)
  const { transformerTwoslash } = await import(workerData.twoslash)
  const transformer = transformerTwoslash({ explicitTrigger: true })
  const highlighter = await getSingletonHighlighter({ themes: [], langs: ["ts"] })
  highlighter.codeToHast("const a = 1", {
    lang: "ts",
    theme: "none",
    meta: { __raw: "twoslash" },
    transformers: [transformer],
  })
  return { bundledLanguages, highlighter, transformer }
})()
parentPort.on("message", async request => {
  try {
    const { bundledLanguages, highlighter, transformer } = await ready
    const lang = request.lang in bundledLanguages ? request.lang : "ts"
    await highlighter.loadLanguage(lang)
    await highlighter.loadTheme(request.themes.light, request.themes.dark)
    const fragment = highlighter.codeToHast(request.code, {
      lang,
      themes: request.themes,
      meta: { __raw: request.meta, "data-meta": request.meta },
      transformers: [transformer],
    })
    const pre = fragment.children[0]
    parentPort.postMessage({ id: request.id, pre: pre && pre.type === "element" ? pre : undefined })
  } catch (error) {
    parentPort.postMessage({ id: request.id, error: String((error && error.stack) || error) })
  }
})
`

// addLanguageClass put `language-<name>` on the block's `<code>`
function readLanguage(pre: Element) {
  const code = pre.children.find(
    (child): child is Element => child.type === "element" && child.tagName === "code",
  )
  const classes = code?.properties.className
  const name = Array.isArray(classes)
    ? classes.find(item => typeof item === "string" && item.startsWith("language-"))
    : undefined
  return typeof name === "string" ? name.slice("language-".length) : "ts"
}
