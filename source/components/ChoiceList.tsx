import { CheckIcon } from "lucide-react"
import type { MouseEvent, ReactNode } from "react"
import { cn } from "cn"

export type Choice = {
  id: string
  label: ReactNode
  icon?: ReactNode
  href?: string
  /** Indent level below the top one, for a nested choice like a sub-heading. */
  depth?: number
}

/** The rows of a sheet that picks one of a list, the selected one tinted and ticked. */
export function ChoiceList(props: {
  choices: Choice[]
  selectedId?: string
  onSelect?: (choice: Choice, event: MouseEvent<HTMLElement>) => void
}) {
  return (
    <ul className="-mx-2 flex flex-col gap-0.5">
      {props.choices.map(choice => {
        const selected = choice.id === props.selectedId
        const className = cn(
          "hover:bg-muted active:bg-muted flex h-10 w-full items-center gap-2.5 rounded-control px-2 text-left text-base outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-[18px] [&_svg]:shrink-0",
          selected && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        )
        const content = (
          <>
            {choice.icon}
            <span
              className={cn(
                "flex-1 truncate",
                choice.depth === 1 && "ps-4",
                (choice.depth ?? 0) >= 2 && "ps-8",
              )}
            >
              {choice.label}
            </span>
            {selected && <CheckIcon className="text-primary" />}
          </>
        )
        return (
          <li key={choice.id}>
            {choice.href ? (
              <a
                href={choice.href}
                aria-current={selected || undefined}
                className={className}
                onClick={event => props.onSelect?.(choice, event)}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                aria-pressed={selected}
                className={className}
                onClick={event => props.onSelect?.(choice, event)}
              >
                {content}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
