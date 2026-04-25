import { FileText, icons } from "lucide-react"

/** Resolve a Lucide icon by kebab-case name, falling back to FileText. */
export function resolveArticleIcon(name: string) {
  const key = toPascalCase(name)
  return key in icons ? icons[key as keyof typeof icons] : FileText
}

/** Curated set of icons used as default fallbacks for articles without one. */
const defaultIconNames = [
  "binary",
  "blocks",
  "brain-circuit",
  "bug",
  "cloud",
  "code",
  "cpu",
  "database",
  "file-code",
  "git-branch",
  "globe",
  "hard-drive",
  "layers",
  "network",
  "rocket",
  "server",
  "shield",
  "sliders-horizontal",
  "terminal",
  "webhook",
  "zap",
]

/** Deterministic icon name based on article path */
export function pickDefaultIcon(path: string) {
  let hash = 0
  for (let i = 0; i < path.length; i++) {
    hash = (hash * 31 + path.charCodeAt(i)) | 0
  }
  return defaultIconNames[Math.abs(hash) % defaultIconNames.length]!
}

function toPascalCase(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}
