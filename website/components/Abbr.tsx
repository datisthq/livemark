/** Renders an abbreviation with a tooltip showing its full form */
export function Abbr(props: { text: string; title: string }) {
  return (
    <abbr
      title={props.title}
      className="no-underline border-b border-dotted border-muted-foreground cursor-help"
    >
      {props.text}
    </abbr>
  )
}
