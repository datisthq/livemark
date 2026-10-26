import { AlertTriangle, Flame, Info, Lightbulb } from "lucide-react"
import { cn } from "cn"
import type { MessageKey } from "../models/message.ts"
import { useMessages } from "../hooks/site.ts"

type CalloutType = "note" | "tip" | "info" | "warning" | "danger"

interface CalloutConfig {
  icon: React.ElementType
  label: MessageKey
  classes: string
}

const configs: Record<CalloutType, CalloutConfig> = {
  note: {
    icon: Info,
    label: "callout.note",
    classes:
      "border-blue-500/30 bg-blue-50/50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
  },
  info: {
    icon: Info,
    label: "callout.info",
    classes:
      "border-blue-500/30 bg-blue-50/50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
  },
  tip: {
    icon: Lightbulb,
    label: "callout.tip",
    classes: "border-positive/30 bg-positive-tint/50 text-positive-tint-foreground",
  },
  warning: {
    icon: AlertTriangle,
    label: "callout.warning",
    classes: "border-warning/30 bg-warning-tint/50 text-warning-tint-foreground",
  },
  danger: {
    icon: Flame,
    label: "callout.danger",
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
  const t = useMessages()
  const type = props.type ?? "note"
  const config = configs[type]
  const Icon = config.icon
  const title = props.title ?? t(config.label)

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
