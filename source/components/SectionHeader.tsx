import { cn } from "../helpers/style.ts"

export function SectionHeader(props: {
  label?: string
  title: string
  subtitle?: string
  className?: string
  align?: "left" | "center"
}) {
  const align = props.align ?? "center"

  return (
    <div
      className={cn(
        align === "center" && "text-center",
        "mb-12",
        props.className,
      )}
    >
      {props.label && (
        <p className="text-primary text-xs uppercase tracking-[0.2em] font-medium mb-3">
          {props.label}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold italic mb-4">
        {props.title}
      </h2>
      {props.subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {props.subtitle}
        </p>
      )}
    </div>
  )
}
