import { buttonVariants } from "../elements/button.tsx"
import { cn } from "../utils/style.ts"

/** Styled link button rendered from ::button leaf directives */
export function LinkButton(props: {
  href: string
  label: string
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
  size?: "default" | "sm" | "lg"
}) {
  return (
    <a
      href={props.href}
      className={cn(
        buttonVariants({
          variant: props.variant,
          size: props.size,
        }),
        "no-underline",
      )}
    >
      {props.label}
    </a>
  )
}
