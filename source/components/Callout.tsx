import { AlertTriangle, Flame, Info, Lightbulb } from "lucide-react"
import { cn } from "cn"

type CalloutType = "note" | "tip" | "info" | "warning" | "danger"

interface CalloutConfig {
  icon: React.ElementType
  label: string
  classes: string
}

const configs: Record<CalloutType, CalloutConfig> = {
  note: {
    icon: Info,
    label: "Note",
    classes:
      "border-blue-500/30 bg-blue-50/50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
  },
  info: {
    icon: Info,
    label: "Info",
    classes:
      "border-blue-500/30 bg-blue-50/50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    classes: "border-positive/30 bg-positive-tint/50 text-positive-tint-foreground",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    classes: "border-warning/30 bg-warning-tint/50 text-warning-tint-foreground",
  },
  danger: {
    icon: Flame,
    label: "Danger",
    classes:
      "border-destructive/30 bg-destructive-tint/50 text-destructive-tint-foreground",
  },
}

/** Styled callout block for notes, tips, warnings, and other admonitions */
export function Callout(props: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}) {
  const type = props.type ?? "note"
  const config = configs[type]
  const Icon = config.icon
  const title = props.title ?? config.label

  return (
    <aside className={cn("not-prose my-4 rounded-card border px-4 py-3", config.classes)}>
      <div className="flex items-center gap-2 font-semibold text-sm mb-2">
        <Icon className="size-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-sm [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {props.children}
      </div>
    </aside>
  )
}
