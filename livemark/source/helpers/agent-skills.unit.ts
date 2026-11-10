import { createHash } from "node:crypto"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import { temporaryDirectory } from "tempy"
import { loadAgentSkills, renderSkillsIndex } from "./agent-skills.ts"

function writeSkill(root: string, dir: string, source: string) {
  mkdirSync(join(root, "skills", dir), { recursive: true })
  writeFileSync(join(root, "skills", dir, "SKILL.md"), source)
}

describe("loadAgentSkills", () => {
  it("reads name and description from each matched SKILL.md", () => {
    const root = temporaryDirectory()
    writeSkill(root, "b", "---\nname: beta\ndescription: >\n  Folded\n  text\n---\n# B\n")
    writeSkill(root, "a", "---\nname: alpha\ndescription: First\n---\n# A\n")
    const skills = loadAgentSkills({ root, patterns: ["skills/*/SKILL.md"] })
    expect(skills.map(s => [s.name, s.description])).toEqual([
      ["alpha", "First"],
      ["beta", "Folded text\n"],
    ])
  })

  it("rejects a skill whose name agents cannot address", () => {
    const root = temporaryDirectory()
    writeSkill(root, "a", "---\nname: Not Valid\ndescription: First\n---\n")
    expect(() => loadAgentSkills({ root, patterns: ["skills/*/SKILL.md"] })).toThrow(
      "skills/a/SKILL.md",
    )
  })
})

describe("renderSkillsIndex", () => {
  it("publishes each skill with a digest of its exact bytes", () => {
    const source = Buffer.from("---\nname: alpha\ndescription: First\n---\n")
    const index = JSON.parse(
      renderSkillsIndex({
        skills: [{ name: "alpha", description: "First", source }],
        base: "/repo",
      }),
    )
    expect(index).toEqual({
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          name: "alpha",
          type: "skill-md",
          description: "First",
          url: "/repo/.well-known/agent-skills/alpha/SKILL.md",
          digest: `sha256:${createHash("sha256").update(source).digest("hex")}`,
        },
      ],
    })
  })
})
