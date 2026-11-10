import type { ComponentType } from "react"
import * as runtime from "react/jsx-runtime"

export type MdxComponent = ComponentType<{ components?: object }>

/** Evaluate a compiled MDX function body into its component. */
export function createMdxComponent(code: string) {
  // mdx.compile's function body reads its JSX runtime from `arguments[0]`
  const scope: unknown = Reflect.apply(new Function(code), undefined, [runtime])
  if (!isMdxModule(scope)) throw new Error("the article exports no default component")
  return scope.default
}

function isMdxModule(value: unknown): value is { default: MdxComponent } {
  return (
    typeof value === "object" &&
    value !== null &&
    "default" in value &&
    typeof value.default === "function"
  )
}
