import { createHash } from "node:crypto"
import { globSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { parse } from "yaml"
import { z } from "zod"

const SKILLS_SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json"
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/

const SkillFrontmatter = z.object({
  name: z
    .string()
    .max(64)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  description: z.string().min(1).max(1024),
})

/** A `SKILL.md` published for agents, with the raw bytes its digest covers. */
export interface AgentSkill {
  name: string
  description: string
  source: Buffer
}

/** Read every `SKILL.md` the `skills` globs match, in a stable order. */
export function loadAgentSkills(props: { root: string; patterns: string[] }) {
  return globSync(props.patterns, { cwd: props.root })
    .sort()
    .map(file => {
      const source = readFileSync(resolve(props.root, file))
      const frontmatter = FRONTMATTER_RE.exec(source.toString("utf-8"))?.[1] ?? ""
      const parsed = SkillFrontmatter.safeParse(parse(frontmatter))
      if (!parsed.success) {
        throw new Error(
          `${file}: a published skill needs a frontmatter \`name\` (lowercase, hyphenated) and \`description\``,
        )
      }
      return { ...parsed.data, source }
    })
}

/** Where a skill is published inside the build output (no base). */
export function buildSkillFileName(name: string) {
  return `.well-known/agent-skills/${name}/SKILL.md`
}

/** Render the Agent Skills discovery index (v0.2.0) for the published skills. */
export function renderSkillsIndex(props: { skills: AgentSkill[]; base?: string }) {
  const skills = props.skills.map(skill => ({
    name: skill.name,
    type: "skill-md",
    description: skill.description,
    url: `${props.base ?? ""}/${buildSkillFileName(skill.name)}`,
    digest: `sha256:${createHash("sha256").update(skill.source).digest("hex")}`,
  }))
  return `${JSON.stringify({ $schema: SKILLS_SCHEMA, skills }, null, 2)}\n`
}
