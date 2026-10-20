import { bundledLanguages, bundledLanguagesInfo } from "shiki"

const FENCE_PATTERN = /^[ \t>]*(?:`{3,}|~{3,})[ \t]*([\w+#.-]+)/gm

/** The bundled Shiki languages a document's fences name, plus the ones their grammars embed lazily. */
export async function collectFenceLanguages(content: string) {
  const names = new Set(
    Array.from(content.matchAll(FENCE_PATTERN), m => (m[1] ?? "").toLowerCase()),
  )
  const infos = bundledLanguagesInfo.filter(
    info => names.has(info.id) || info.aliases?.some(alias => names.has(alias)),
  )
  // Lazy embeds (the `js` fence inside a `md` fence) are not loaded with their host, so
  // without them nested code renders plain or not depending on what earlier pages loaded.
  const grammars = await Promise.all(infos.map(info => info.import()))
  const embedded = grammars.flatMap(grammar =>
    grammar.default.flatMap(lang => lang.embeddedLangsLazy ?? []),
  )
  const langs = new Set([...infos.map(info => info.id), ...embedded])
  return [...langs].filter(lang => lang in bundledLanguages)
}
