/** Heading component that wraps content in an anchor link to itself */
function createHeading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function Heading(props: React.HTMLAttributes<HTMLHeadingElement>) {
    if (!props.id) return <Tag {...props} />
    return (
      <Tag {...props}>
        <a href={`#${props.id}`}>{props.children}</a>
      </Tag>
    )
  }
}

export const headingComponents = {
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
}
