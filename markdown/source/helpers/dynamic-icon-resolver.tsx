import { useIcons } from "../hooks/icons.ts"
import { toIconKey } from "./icon-names.ts"

/** Resolves a Lucide icon by kebab-case name from the icons an `IconsProvider` gives */
export default function DynamicIconResolver(props: { name: string; className?: string }) {
  const Icon = useIcons()[toIconKey(props.name)]
  if (!Icon) return null
  return <Icon className={props.className} />
}
