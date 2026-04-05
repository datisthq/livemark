import type { ComponentProps } from "react"

/** Styled wrapper for definition lists produced by remark-definition-list */
export function DefinitionList(props: ComponentProps<"dl">) {
  return <dl {...props} className="not-prose space-y-4" />
}

/** Styled definition term rendered as bold text */
export function DefinitionTerm(props: ComponentProps<"dt">) {
  return <dt {...props} className="text-foreground font-semibold" />
}

/** Styled definition detail with a left border accent */
export function DefinitionDetail(props: ComponentProps<"dd">) {
  return (
    <dd
      {...props}
      className="ml-0 pl-4 border-l-2 border-border text-muted-foreground"
    />
  )
}
