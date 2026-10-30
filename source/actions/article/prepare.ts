import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { DEFAULT_EXCLUDES } from "../../settings.ts"
import type { Config } from "../../models/config.ts"
import { buildChangelog, cacheIncludeGlob } from "../changelog/build.ts"
import { createCompileCache } from "../../helpers/compile-cache.ts"
import { readRepository } from "../../helpers/edit-url.ts"
import { buildSites, resolveLanguages } from "../../helpers/site.ts"
import { cacheDirFor } from "../../helpers/target-dir.ts"

/** Everything loading one article needs that is shared by all of them. */
export type ArticleScope = Awaited<ReturnType<typeof prepareArticles>>

/** Build the changelog sections and gather what every article load shares: the globs
 *  that select articles, each file's last commit date, the repository and the cache. */
export async function prepareArticles(config: Config) {
  const [defaultSite] = buildSites(config)
  const changelogSections =
    defaultSite.config.sections?.filter(s => s.type === "changelog") ?? []
  for (const section of changelogSections) {
    await buildChangelog(section, config)
  }

  const configInclude = toArray(config.include)
  const include = [
    ...configInclude,
    ...changelogSections.map(section => cacheIncludeGlob(section, config)),
  ]
  // When the consumer doesn't have a .gitignore, fall back to a sensible
  // floor so `**/*.md` doesn't sweep up every README.md under node_modules,
  // build outputs, etc. With a .gitignore present we trust the user.
  const hasGitignore = existsSync(resolve(config.root, ".gitignore"))
  const exclude = [
    ...(hasGitignore ? [] : DEFAULT_EXCLUDES),
    ...(config.exclude ? toArray(config.exclude) : []),
  ]

  return {
    config,
    configInclude,
    include,
    exclude,
    languages: resolveLanguages(config.languages),
    lastUpdatedByFile: readLastUpdatedDates(config.root, configInclude),
    repository: readRepository(config.root),
    cache: createCompileCache({
      dir: join(cacheDirFor(config.configPath), "articles"),
      config,
    }),
  }
}

function toArray(value: string | string[]) {
  return Array.isArray(value) ? value : [value]
}

// One `git log` for every file: a spawn per article blocks the build ~30 ms each
function readLastUpdatedDates(root: string, include: string[]) {
  const dates = new Map<string, string>()
  try {
    const log = execFileSync(
      "git",
      [
        "-c",
        "core.quotePath=false",
        "log",
        "--format=%x00%cI",
        "--name-only",
        "--relative",
        "--no-renames",
        "--",
        ...buildGitPathspecs(include),
      ],
      {
        cwd: root,
        encoding: "utf-8",
        maxBuffer: 256 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      },
    )
    let date: string | undefined
    for (const line of log.split("\n")) {
      if (line.startsWith("\0")) date = line.slice(1)
      else if (line && date && !dates.has(line)) dates.set(line, date)
    }
    return dates
  } catch {
    return dates
  }
}

// Git's glob magic lacks braces, negation and extglobs; such a pattern would silently
// drop dates, so it falls back to the whole history
function buildGitPathspecs(include: string[]) {
  if (include.some(pattern => /[{}!()]/.test(pattern))) return []
  return include.map(pattern => `:(glob)${pattern}`)
}
