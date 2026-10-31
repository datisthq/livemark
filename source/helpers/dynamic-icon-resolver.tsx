import { icons } from "livemark:icons"
import { toIconKey } from "./icon-names.ts"

/** Resolves a Lucide icon by kebab-case name from the icons the site uses */
export default function DynamicIconResolver(props: { name: string; className?: string }) {
  const Icon = icons[toIconKey(props.name)]
  if (!Icon) return null
  return <Icon className={props.className} />
}
