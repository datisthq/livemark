import type { Tokenizer } from "@orama/orama"

// Written without spaces between words, so Orama's default tokenizer would index a
// whole sentence as one word that no query ever matches.
const UNSPACED_LANGUAGES = new Set(["zh", "ja", "th", "lo", "km", "my"])

/** Build an Orama tokenizer that finds word breaks with `Intl.Segmenter`, for a
 *  language written without spaces; `undefined` keeps Orama's default */
export function createSearchTokenizer(language: string) {
  if (!UNSPACED_LANGUAGES.has(language.split("-")[0] ?? "")) return undefined
  const segmenter = new Intl.Segmenter(language, { granularity: "word" })
  const tokenizer: Tokenizer = {
    language,
    normalizationCache: new Map(),
    tokenize: raw => {
      const segments = [...segmenter.segment(raw.toLowerCase())]
      return [...new Set(segments.filter(s => s.isWordLike).map(s => s.segment))]
    },
  }
  return tokenizer
}
