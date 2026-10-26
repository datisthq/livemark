import AR from "country-flag-icons/react/3x2/AR"
import AT from "country-flag-icons/react/3x2/AT"
import AU from "country-flag-icons/react/3x2/AU"
import BE from "country-flag-icons/react/3x2/BE"
import BR from "country-flag-icons/react/3x2/BR"
import CA from "country-flag-icons/react/3x2/CA"
import CH from "country-flag-icons/react/3x2/CH"
import CN from "country-flag-icons/react/3x2/CN"
import CZ from "country-flag-icons/react/3x2/CZ"
import DE from "country-flag-icons/react/3x2/DE"
import DK from "country-flag-icons/react/3x2/DK"
import ES from "country-flag-icons/react/3x2/ES"
import FI from "country-flag-icons/react/3x2/FI"
import FR from "country-flag-icons/react/3x2/FR"
import GB from "country-flag-icons/react/3x2/GB"
import GR from "country-flag-icons/react/3x2/GR"
import HK from "country-flag-icons/react/3x2/HK"
import HU from "country-flag-icons/react/3x2/HU"
import ID from "country-flag-icons/react/3x2/ID"
import IE from "country-flag-icons/react/3x2/IE"
import IL from "country-flag-icons/react/3x2/IL"
import IN from "country-flag-icons/react/3x2/IN"
import IR from "country-flag-icons/react/3x2/IR"
import IT from "country-flag-icons/react/3x2/IT"
import JP from "country-flag-icons/react/3x2/JP"
import KR from "country-flag-icons/react/3x2/KR"
import MX from "country-flag-icons/react/3x2/MX"
import NL from "country-flag-icons/react/3x2/NL"
import NO from "country-flag-icons/react/3x2/NO"
import PL from "country-flag-icons/react/3x2/PL"
import PT from "country-flag-icons/react/3x2/PT"
import RO from "country-flag-icons/react/3x2/RO"
import RU from "country-flag-icons/react/3x2/RU"
import SA from "country-flag-icons/react/3x2/SA"
import SE from "country-flag-icons/react/3x2/SE"
import TH from "country-flag-icons/react/3x2/TH"
import TR from "country-flag-icons/react/3x2/TR"
import TW from "country-flag-icons/react/3x2/TW"
import UA from "country-flag-icons/react/3x2/UA"
import US from "country-flag-icons/react/3x2/US"
import VN from "country-flag-icons/react/3x2/VN"

// Curated rather than the whole set: each flag is its own SVG component, and
// importing all ~250 would ship every one of them in the header chunk.
const FLAGS: Record<string, typeof GB> = {
  ar: AR,
  at: AT,
  au: AU,
  be: BE,
  br: BR,
  ca: CA,
  ch: CH,
  cn: CN,
  cz: CZ,
  de: DE,
  dk: DK,
  es: ES,
  fi: FI,
  fr: FR,
  gb: GB,
  gr: GR,
  hk: HK,
  hu: HU,
  id: ID,
  ie: IE,
  il: IL,
  in: IN,
  ir: IR,
  it: IT,
  jp: JP,
  kr: KR,
  mx: MX,
  nl: NL,
  no: NO,
  pl: PL,
  pt: PT,
  ro: RO,
  ru: RU,
  sa: SA,
  se: SE,
  th: TH,
  tr: TR,
  tw: TW,
  ua: UA,
  us: US,
  vn: VN,
}

/** A country flag by lowercase ISO 3166-1 code; a code without a bundled flag renders
 *  nothing. */
export function LanguageFlag(props: { code?: string; className?: string }) {
  const Flag = props.code ? FLAGS[props.code] : undefined
  if (!Flag) return null
  return <Flag aria-hidden className={props.className} />
}
