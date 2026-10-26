/** Format an ISO date as a short, locale-aware date ("Mar 7, 2025" in English). */
export function formatShortDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
