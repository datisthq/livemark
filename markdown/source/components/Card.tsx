import { Link } from "@tanstack/react-router"
import { DynamicIcon } from "../helpers/dynamic-icon.tsx"
import {
  Card as CardElement,
  CardContent,
  CardHeader,
  CardTitle,
} from "../elements/card.tsx"

/** Card component with optional icon, title, description, and link */
export function Card(props: {
  title: string
  href?: string
  icon?: string
  children?: React.ReactNode
}) {
  const card = (
    <CardElement size="sm" className="transition-colors hover:bg-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {props.icon && (
            <DynamicIcon name={props.icon} className="size-5 text-primary" />
          )}
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
