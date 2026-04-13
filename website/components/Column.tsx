/** Single column within a Columns grid */
export function Column(props: { children: React.ReactNode }) {
  return <div className="max-w-none">{props.children}</div>
}
