import { parse } from "yaml"

const FRONTMATTER = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/

/** Split a Markdown file into its YAML frontmatter and its trimmed body. */
export function parseFrontmatter(source: string) {
  const text = source.replace(/^﻿/, "")
  const match = FRONTMATTER.exec(text)
  if (!match) return { data: {}, content: text.trim() }
  const data: unknown = parse(match[1] ?? "")
  return {
    data: typeof data === "object" && data !== null ? data : {},
    content: text.slice(match[0].length).trim(),
  }
}
