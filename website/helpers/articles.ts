import { allArticles } from "content-collections"

/** Articles sorted by frontmatter order (unordered articles come last) */
export const sortedArticles = [...allArticles].sort((a, b) => {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER
  const bo = b.order ?? Number.MAX_SAFE_INTEGER
  return ao - bo
})
