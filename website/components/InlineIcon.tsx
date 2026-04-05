import { icons } from "lucide-react"

function toPascalCase(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

/** Renders a Lucide icon inline by name */
export function InlineIcon(props: { name: string; className?: string }) {
  const key = toPascalCase(props.name)
  if (!(key in icons)) return null
  const Icon = icons[key as keyof typeof icons]

  const className = props.className
    ? `inline-block size-4 align-text-bottom ${props.className}`
    : "inline-block size-4 align-text-bottom"

  return <Icon className={className} />
}
