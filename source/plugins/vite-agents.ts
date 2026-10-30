import { existsSync, readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import type { Plugin } from "vite"
import {
  buildSkillFileName,
  loadAgentSkills,
  renderSkillsIndex,
} from "../helpers/agent-skills.ts"
import {
  buildTwinFileName,
  renderLlmsText,
  renderMarkdownTwin,
  renderSectionIndex,
} from "../helpers/llms.ts"
import type { ArticleStore } from "../helpers/article-store.ts"
import { resolveIncludes } from "../helpers/resolve-includes.ts"
import { buildSites } from "../helpers/site.ts"
import type { Config } from "../models/config.ts"

export interface AgentsOptions {
  config: Config
  store: ArticleStore
}

/** Emit what AI agents look for into the client build: a Markdown twin of
 *  every article and section listing at `<path>index.md`, `llms.txt`, the Agent Skills index for
 *  `config.skills`, and a `_headers` file whose `Link` points agents at them. */
export function agents(opts: AgentsOptions): Plugin {
  const publicDir = join(opts.config.root, ".livemark", "public")
  return {
    name: "livemark:agents",
    applyToEnvironment(env) {
      return env.name === "client"
    },
    async generateBundle() {
      // Vite copies the publicDir before writeBundle, so emitting a file the
      // project ships under `.livemark/public/` would silently replace it.
      const emit = (fileName: string, source: string | Buffer) => {
        if (existsSync(join(publicDir, fileName))) return
        this.emitFile({ type: "asset", fileName, source })
      }

      const articles = await opts.store.list()
      const contents = await Promise.all(
        articles.map(article =>
          resolveIncludes(article.content, resolve(opts.config.root, article.file)),
        ),
      )
      articles.forEach((article, index) => {
        const content = contents[index] ?? article.content
        emit(buildTwinFileName(article.path), renderMarkdownTwin({ article, content }))
      })

      const hasTwin = (path: string) => articles.some(a => a.path === path)
      // Each language gets its own `llms.txt` under its prefix, listing only its articles.
      for (const site of buildSites(opts.config)) {
        const siteArticles = articles.filter(a => a.language === site.language.code)
        const llms = renderLlmsText({ config: site.config, articles: siteArticles })
        const prefix = site.language.prefix.slice(1)
        emit(`${prefix}llms.txt`, llms)
        if (!hasTwin(site.language.prefix)) emit(`${prefix}index.md`, llms)
        // A rewrite to a missing twin is a 404, so every listing page needs one too.
        for (const section of site.config.sections ?? []) {
          if (section.type === "custom" || section.prefix === site.language.prefix)
            continue
          if (hasTwin(section.prefix)) continue
          if (section.type === "changelog" && !site.language.default) continue
          emit(
            buildTwinFileName(section.prefix),
            renderSectionIndex({ config: site.config, section, articles: siteArticles }),
          )
        }
      }

      const patterns = opts.config.skills ?? []
      const skills = loadAgentSkills({
        root: opts.config.root,
        patterns: Array.isArray(patterns) ? patterns : [patterns],
      })
      for (const skill of skills) emit(buildSkillFileName(skill.name), skill.source)
      if (skills.length) {
        emit(
          ".well-known/agent-skills/index.json",
          renderSkillsIndex({ skills, base: opts.config.base }),
        )
      }

      const headersFile = join(publicDir, "_headers")
      this.emitFile({
        type: "asset",
        fileName: "_headers",
        source: renderHeaders({
          base: opts.config.base,
          hasSkills: skills.length > 0,
          existing: existsSync(headersFile) ? readFileSync(headersFile, "utf-8") : "",
        }),
      })
    },
  }
}

/** Render `_headers` (Cloudflare, Netlify): a `Link` on the home page naming
 *  `llms.txt`, its Markdown twin and the skills index, after any rules the
 *  project ships itself. */
export function renderHeaders(props: {
  base?: string
  hasSkills: boolean
  existing?: string
}) {
  const base = props.base ?? ""
  const links = [
    `<${base}/llms.txt>; rel="describedby"; type="text/plain"`,
    `<${base}/index.md>; rel="alternate"; type="text/markdown"`,
  ]
  if (props.hasSkills) {
    links.push(
      `<${base}/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"`,
    )
  }
  const rule = `${base}/\n  Link: ${links.join(", ")}\n`
  const existing = props.existing?.trimEnd()
  return existing ? `${existing}\n\n${rule}` : rule
}
