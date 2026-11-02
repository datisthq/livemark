import { readFile } from "node:fs/promises"
import { basename, resolve } from "node:path"
import { Article } from "../../models/article.ts"
import { buildEditUrl } from "../../helpers/edit-url.ts"
import { parseFrontmatter } from "../../helpers/frontmatter.ts"
import { stripLeadingH1 } from "../../helpers/llms.ts"
import { findOriginalFile, resolveArticlePath } from "../../helpers/article-path.ts"
import { resolveAssetPath } from "../../helpers/resolve-asset-path.ts"
import { resolveIncludes } from "../../helpers/resolve-includes.ts"
import { extractSearchText } from "../../helpers/search-text.ts"
import {
  detectLanguage,
  localizeArticlePath,
  unlocalizePath,
} from "../../helpers/site.ts"
import { compileArticle } from "./compile.ts"
import type { ArticleScope } from "./prepare.ts"

/** An article as the site gets it: frontmatter, routing, search text and compiled body. */
export type LoadedArticle = Awaited<ReturnType<typeof loadArticle>>

/** Read, validate and compile one article; `file` is relative to the project root. */
export async function loadArticle(scope: ArticleScope, file: string) {
  const config = scope.config
  const filePath = resolve(config.root, file)
  const source = parseFrontmatter(await readFile(filePath, "utf-8"))
  const parsed = Article.parse({ ...source.data, content: source.content })
  const patch = config.patches?.find(p => p.file === file)
  const doc = patch ? { ...parsed, ...patch.article } : parsed
  const content = await resolveIncludes(doc.content, filePath)
  const title = doc.title ?? extractTitle(content, file)
  const detected = detectLanguage({
    file: basename(file),
    language: doc.language,
    languages: scope.languages,
  })
  const path = doc.path
    ? resolveArticlePath({ file, name: detected.name, include: [], path: doc.path })
    : localizeArticlePath(
        resolveArticlePath({
          file,
          name: detected.name,
          include: scope.configInclude,
          path: detected.suffixed
            ? await readOriginalPath(scope, file, detected.name)
            : undefined,
        }),
        detected.language,
      )
  if (!path.startsWith(detected.language.prefix)) {
    throw new Error(
      `${file}: path "${path}" must start with "${detected.language.prefix}", its language's prefix`,
    )
  }
  const key = unlocalizePath(path, detected.language)
  // The layout renders `title` as the h1, so a leading h1 in the body would be a
  // second one, worse when a patch overrides the title
  const bodyContent = stripLeadingH1(content)
  const format = doc.format ?? (file.endsWith(".mdx") ? "mdx" : "md")
  const { mdx, tocItems } = await scope.cache.read(
    { file, format, content: bodyContent },
    () => compileArticle({ content: bodyContent, filePath, format, config }),
  )
  return {
    ...doc,
    file,
    sourceUrl:
      doc.sourceUrl ?? (scope.repository && buildEditUrl(scope.repository, file)),
    lastUpdated: scope.lastUpdatedByFile.get(file),
    image: doc.image
      ? resolveAssetPath(doc.image, filePath, config.root, config.base)
      : undefined,
    title,
    path,
    key,
    language: detected.language.code,
    tocItems,
    searchText: extractSearchText(content),
    mdx,
  }
}

// A translation without a `path` takes its original's, so the two stay paired
async function readOriginalPath(scope: ArticleScope, file: string, name: string) {
  const original = findOriginalFile({ root: scope.config.root, file, name })
  if (!original) return undefined
  const source = parseFrontmatter(
    await readFile(resolve(scope.config.root, original), "utf-8"),
  )
  const patch = scope.config.patches?.find(p => p.file === original)
  const parsed = Article.pick({ path: true }).safeParse(source.data)
  return patch?.article.path ?? parsed.data?.path
}

function extractTitle(content: string, file: string) {
  const match = /^#\s+(.+)$/m.exec(content)
  if (match?.[1]) return match[1]
  const stem = file.replace(/\.[^./]+$/, "").replace(/\/index$/, "")
  return stem.split("/").pop() ?? stem
}
