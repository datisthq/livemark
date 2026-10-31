/** The pages before and after `path` in a site's reading order, with its landing page,
 *  when it has one, ahead of the first article */
export function findPageNeighbours(props: {
  sequence: string[]
  path: string
  landing?: string
}) {
  const landing = props.landing
  const pages =
    landing && !props.sequence.includes(landing)
      ? [landing, ...props.sequence]
      : props.sequence
  const index = pages.indexOf(props.path)
  if (index < 0) return {}
  return { prev: pages[index - 1], next: pages[index + 1] }
}
