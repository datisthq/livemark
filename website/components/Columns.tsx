/** Grid layout for arranging content side by side */
export function Columns(props: { cols?: string; children: React.ReactNode }) {
  const cols = props.cols ? parseInt(props.cols, 10) : undefined
  const style = cols
    ? { gridTemplateColumns: `repeat(${cols}, 1fr)` }
    : undefined
  return (
    <div className="grid gap-6 my-4 sm:grid-cols-2" style={style}>
      {props.children}
    </div>
  )
}

/** Single column within a Columns grid */
export function Column(props: { children: React.ReactNode }) {
  return <div className="max-w-none">{props.children}</div>
}
