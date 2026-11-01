import { Badge as BadgeElement } from "../elements/badge.tsx"

/** Inline badge rendered from :badge text directives */
export function Badge(props: {
  label: string
  variant?: "default" | "secondary" | "positive" | "warning" | "destructive" | "outline"
}) {
  return <BadgeElement variant={props.variant}>{props.label}</BadgeElement>
}
