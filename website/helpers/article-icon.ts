import {
  Binary,
  Blocks,
  BrainCircuit,
  Bug,
  Cloud,
  Code,
  Cpu,
  Database,
  FileCode,
  GitBranch,
  Globe,
  HardDrive,
  Layers,
  Network,
  Rocket,
  Server,
  Shield,
  Terminal,
  Webhook,
  Zap,
} from "lucide-react"

export const articleIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  binary: Binary,
  blocks: Blocks,
  "brain-circuit": BrainCircuit,
  bug: Bug,
  cloud: Cloud,
  code: Code,
  cpu: Cpu,
  database: Database,
  "file-code": FileCode,
  "git-branch": GitBranch,
  globe: Globe,
  "hard-drive": HardDrive,
  layers: Layers,
  network: Network,
  rocket: Rocket,
  server: Server,
  shield: Shield,
  terminal: Terminal,
  webhook: Webhook,
  zap: Zap,
}

const defaultIconNames = Object.keys(articleIcons)

/** Deterministic icon name based on article path */
export function pickDefaultIcon(path: string) {
  let hash = 0
  for (let i = 0; i < path.length; i++) {
    hash = (hash * 31 + path.charCodeAt(i)) | 0
  }
  return defaultIconNames[Math.abs(hash) % defaultIconNames.length]!
}
