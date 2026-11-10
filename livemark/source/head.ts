import type { RootHead } from "./helpers/head.ts"

/** Final pass over the site-wide `<head>`; shadow with `.livemark/head.ts` to add,
 *  drop or replace tags. */
export function customizeHead(head: RootHead) {
  return head
}
