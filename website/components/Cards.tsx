import { Link } from "@tanstack/react-router"
import {
  Card as CardElement,
  CardContent,
  CardHeader,
  CardTitle,
} from "../elements/card.tsx"

/** Grid container for card components */
export function Cards(props: { children: React.ReactNode }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-4 my-4 sm:grid-cols-2">
      {props.children}
    </div>
  )
}

/** Card component with optional icon, title, description, and link */
export function Card(props: {
  title: string
  href?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}) {
  const card = (
    <CardElement size="sm" className="transition-colors hover:bg-accent">
      <CardHeader>
        {props.icon && <div className="text-primary">{props.icon}</div>}
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      {props.children && (
        <CardContent>
          <p className="text-muted-foreground">{props.children}</p>
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
