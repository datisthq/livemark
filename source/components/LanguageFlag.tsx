import { flags } from "livemark:virtual"

/** A country flag by lowercase ISO 3166-1 code; a code without a flag renders nothing.
 *  Only the flags of the site's languages are bundled. */
export function LanguageFlag(props: { code?: string; className?: string }) {
  const Flag = props.code ? flags[props.code] : undefined
  if (!Flag) return null
  return <Flag aria-hidden className={props.className} />
}
