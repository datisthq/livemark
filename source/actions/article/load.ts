import { readFile } from "node:fs/promises"
import { basename, resolve } from "node:path"
import { Article } from "../../models/article.ts"
import { buildEditUrl } from "../../helpers/edit-url.ts"
import { parseFrontmatter } from "../../helpers/frontmatter.ts"
import { stripLeadingH1 } from "../../helpers/llms.ts"
import { resolveArticlePath } from "../../helpers/article-path.ts"
import { resolveAssetPath } from "../../helpers/resolve-asset-path.ts"
import { resolveIncludes } from "../../helpers/resolve-includes.ts"
import { extractSearchText } from "../../helpers/search-text.ts"
import { detectLanguage, localizeArticlePath } from "../../helpers/site.ts"
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
  const key = resolveArticlePath({
    file,
    name: detected.name,
    include: scope.configInclude,
    path: doc.path,
  })
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
    path: localizeArticlePath(key, detected.language),
    key,
    language: detected.language.code,
    tocItems,
    searchText: extractSearchText(content),
    mdx,
  }
}

function extractTitle(content: string, file: string) {
  const match = /^#\s+(.+)$/m.exec(content)
  if (match?.[1]) return match[1]
  const stem = file.replace(/\.[^./]+$/, "").replace(/\/index$/, "")
  return stem.split("/").pop() ?? stem
}
