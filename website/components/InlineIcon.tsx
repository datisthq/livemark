import { DynamicIcon } from "../helpers/dynamic-icon.tsx"

/** Renders a Lucide icon inline by name */
export function InlineIcon(props: { name: string; className?: string }) {
  const className = props.className
    ? `inline-block size-4 align-text-bottom ${props.className}`
    : "inline-block size-4 align-text-bottom"

  return <DynamicIcon name={props.name} className={className} />
}
