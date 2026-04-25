import { type ComponentProps, useEffect, useState } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../elements/hover-card.tsx"

const FOOTNOTE_PREFIX = "#user-content-fn-"

/** Wraps footnote reference links in a HoverCard that previews footnote content inline */
export function FootnoteRef(props: ComponentProps<"a">) {
  const href = props.href ?? ""
  if (!href.startsWith(FOOTNOTE_PREFIX)) {
    return <a {...props} />
  }

  return <FootnoteHoverCard {...props} href={href} />
}

function FootnoteHoverCard(props: ComponentProps<"a"> & { href: string }) {
  const [footnoteHtml, setFootnoteHtml] = useState("")

  useEffect(() => {
    const targetId = props.href.slice(1)
    const el = document.getElementById(targetId)
    if (!el) return

    const wrapper = document.createElement("div")
    wrapper.innerHTML = el.innerHTML
    for (const backref of wrapper.querySelectorAll("[data-footnote-backref]")) {
      backref.remove()
    }
    setFootnoteHtml(wrapper.innerHTML)
  }, [props.href])

  return (
    <HoverCard>
      <HoverCardTrigger render={<a {...props} />} />
      <HoverCardContent
        className="prose dark:prose-invert text-sm w-80 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
        side="top"
        sideOffset={8}
      >
        {footnoteHtml ? (
          <div dangerouslySetInnerHTML={{ __html: footnoteHtml }} />
        ) : (
          <p className="text-muted-foreground">Footnote not found</p>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
