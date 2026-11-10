declare module "*.md" {
  /** The compiled content, rendered with Livemark's components. */
  const Content: import("react").ComponentType<{ components?: object }>
  export default Content
  export const frontmatter: Record<string, unknown>
  export const toc: import("@livemark/markdown/models/toc.ts").TocItem[]
}

declare module "*.mdx" {
  const Content: import("react").ComponentType<{ components?: object }>
  export default Content
  export const frontmatter: Record<string, unknown>
  export const toc: import("@livemark/markdown/models/toc.ts").TocItem[]
}

declare module "virtual:livemark/collection/*" {
  /** The collection's entries, without bodies, sorted by file. */
  export const entries: import("./actions/collection/define.ts").CollectionEntry[]
  /** Import an entry's compiled module by its id, as its own chunk. */
  export function load(
    id: string,
  ): Promise<import("./actions/collection/define.ts").MarkdownModule>
}
