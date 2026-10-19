import { Badge } from "../elements/badge.tsx"

/** Inline badge rendered from :badge text directives */
export function InlineBadge(props: {
  label: string
  variant?: "default" | "secondary" | "positive" | "warning" | "destructive" | "outline"
}) {
  return <Badge variant={props.variant}>{props.label}</Badge>
}
