/** Simple wrapper that provides a title prop for ContentTabs to read */
export function ContentTab(props: {
  title: string
  children: React.ReactNode
}) {
  return <div>{props.children}</div>
}
