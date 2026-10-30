/** Fields that only an article's own page or the search index needs; they stay out of
 *  the list every page loads. */
const BODY_FIELDS = ["mdx", "content", "tocItems"]
const OMITTED_FIELDS = new Set([...BODY_FIELDS, "searchText"])

/** Virtual module ids the article list, one article's body and a language's search
 *  text are served under. */
export const ARTICLES_ID = "livemark:articles"
export const ARTICLE_BODY_ID = "livemark:article/"
export const SEARCH_INDEX_ID = "livemark:search/"

type ModuleArticle = Record<string, unknown> & {
  path: string
  language: string
  file?: string
}

/** Throw when two articles claim one path, naming both files. */
export function assertUniquePaths(articles: ModuleArticle[]) {
  const files = new Map<string, unknown>()
  for (const article of articles) {
    if (files.has(article.path)) {
      const [first, second] = [files.get(article.path), article.file]
      throw new Error(`${first} and ${second} share the path "${article.path}"`)
    }
    files.set(article.path, article.file)
  }
}

/** The module every page loads: the article list without bodies, and a loader per
 *  article body and per language's search text, each its own chunk. */
export function renderArticlesModule(articles: ModuleArticle[]) {
  const entries = articles.map(article =>
    Object.fromEntries(
      Object.entries(article).filter(([key]) => !OMITTED_FIELDS.has(key)),
    ),
  )
  const bodies = articles.map(
    a => `  ${JSON.stringify(a.path)}: () => import(${JSON.stringify(bodyId(a.path))}),`,
  )
  const languages = [...new Set(articles.map(a => a.language))]
  const searches = languages.map(
    code =>
      `  ${JSON.stringify(code)}: () => import(${JSON.stringify(SEARCH_INDEX_ID + code)}),`,
  )
  return [
    `export const articles = ${JSON.stringify(entries)}`,
    `export const bodies = {\n${bodies.join("\n")}\n}`,
    `export const searchIndexes = {\n${searches.join("\n")}\n}`,
  ].join("\n")
}

/** One article's body module, by its encoded path. */
export function renderBodyModule(articles: ModuleArticle[], encodedPath: string) {
  const path = decodeURIComponent(encodedPath)
  const article = articles.find(a => a.path === path)
  const body = Object.fromEntries(BODY_FIELDS.map(key => [key, article?.[key]]))
  return `export default ${JSON.stringify(body)}`
}

/** A language's search text, one entry per article. */
export function renderSearchModule(articles: ModuleArticle[], code: string) {
  const entries = articles
    .filter(a => a.language === code)
    .map(a => ({ path: a.path, searchText: a.searchText }))
  return `export default ${JSON.stringify(entries)}`
}

function bodyId(path: string) {
  return ARTICLE_BODY_ID + encodeURIComponent(path)
}
