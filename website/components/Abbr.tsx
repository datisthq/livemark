import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../elements/tooltip.tsx"

/** Renders an abbreviation with a shadcn tooltip showing its full form */
export function Abbr(props: { text: string; title: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className="border-b border-dotted border-muted-foreground cursor-help">
        {props.text}
      </TooltipTrigger>
      <TooltipContent>{props.title}</TooltipContent>
    </Tooltip>
  )
}
