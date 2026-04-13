import { Link } from "@tanstack/react-router"
import { icons } from "lucide-react"
import {
  Card as CardElement,
  CardContent,
  CardHeader,
  CardTitle,
} from "../elements/card.tsx"

function toPascalCase(name: string) {
  return name
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

/** Card component with optional icon, title, description, and link */
export function Card(props: {
  title: string
  href?: string
  icon?: string
  children?: React.ReactNode
}) {
  const Icon = props.icon
    ? icons[toPascalCase(props.icon) as keyof typeof icons]
    : undefined

  const card = (
    <CardElement size="sm" className="transition-colors hover:bg-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-5 text-primary" />}
          {props.title}
        </CardTitle>
      </CardHeader>
      {props.children && (
        <CardContent>
          <div className="text-muted-foreground text-sm">{props.children}</div>
        </CardContent>
      )}
    </CardElement>
  )

  if (props.href?.startsWith("http")) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    )
  }

  if (props.href) {
    return <Link to={props.href}>{card}</Link>
  }

  return card
}
