/** Grid container for card components */
export function Cards(props: { children: React.ReactNode }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-4 my-4 sm:grid-cols-2">
      {props.children}
    </div>
  )
}
