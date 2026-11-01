/** Simple wrapper that provides a title prop for Tabs to read */
export function Tab(props: { title: string; children: React.ReactNode }) {
  return <div>{props.children}</div>
}
