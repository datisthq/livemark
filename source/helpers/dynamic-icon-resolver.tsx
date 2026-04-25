import { icons } from "lucide-react"

function toPascalCase(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

/** Resolves a Lucide icon by kebab-case name from the full registry */
export default function DynamicIconResolver(props: {
  name: string
  className?: string
}) {
  const key = toPascalCase(props.name)
  if (!(key in icons)) return null
  const Icon = icons[key as keyof typeof icons]
  return <Icon className={props.className} />
}
