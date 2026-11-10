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
