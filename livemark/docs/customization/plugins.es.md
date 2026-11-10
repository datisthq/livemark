---
description: Añade tus propios plugins de Markdown y HTML al pipeline por el que se compila cada artículo.
icon: puzzle
order: 12
---

# Plugins

Cada artículo se compila con [textlane](https://textlane.dev), un pipeline de Markdown en Rust que también ejecuta plugins de JavaScript. La opción `plugins` le añade los tuyos, en dos ranuras:

- `md` se ejecuta sobre el árbol de Markdown (mdast), donde funcionan los plugins al estilo remark
- `html` se ejecuta sobre el árbol HTML (hast), donde funcionan los plugins al estilo rehype

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"
import * as html from "textlane/html"
import { remarkHello } from "./plugins/remark-hello.ts"

export default defineConfig({
  plugins: {
    md: [remarkHello],
    html: [html.externalLinks({ target: "_blank" })],
  },
})
```

## Qué puede ser un plugin

Cada ranura es una lista que acepta las mismas entradas que el `use` de textlane:

- **Un plugin de JavaScript**: un attacher al estilo unified, una función que devuelve un transformer, que modifica el árbol en el sitio o devuelve uno nuevo. La mayoría de los plugins de transformación de remark y rehype encajan aquí.
- **Un plugin nativo**: uno de los que exportan `textlane/md` y `textlane/html`, como `html.externalLinks()` o `md.shiftHeading()`. Se ejecuta en Rust, así que es más rápido que uno de JavaScript.
- **Un plugin con opciones**: un par `[plugin, options]`.

Un plugin de JavaScript transforma un árbol ya analizado. No puede añadir sintaxis nueva, un parser ni un compilador. Para una sintaxis de bloque nueva, usa una [directiva](/authoring/rich-elements/) y trátala en un plugin `md`.

## Dónde se ejecuta cada ranura

```text
parse → GFM, math, directivas, MDX → plugins md → ids de encabezado, componentes, rutas
→ HTML → resaltado de sintaxis, KaTeX → plugins html → slugs de encabezado, índice → MDX
```

- Los plugins `md` se ejecutan **antes** de que Livemark convierta las directivas en componentes, así que ven todas las directivas. Una directiva que Livemark no conoce les llega intacta. Si no la tratan, se muestra como su texto fuente.
- Los plugins `html` se ejecutan **después** del resaltado de sintaxis y **antes** de los slugs de encabezado y el índice, así que un encabezado que añada un plugin recibe un ancla y aparece en el índice «En esta página».

## Escribir uno

Este plugin `md` sustituye una directiva `::hello` por un párrafo:

```ts title="plugins/remark-hello.ts"
import type { Root } from "mdast"

export function remarkHello() {
  return (tree: Root) => {
    tree.children = tree.children.map(node =>
      node.type === "leafDirective" && node.name === "hello"
        ? { type: "paragraph", children: [{ type: "text", value: "Hello!" }] }
        : node,
    )
  }
}
```

Instala `@types/mdast` o `@types/hast` para los tipos de los árboles e importa `mdast-util-directive` una vez, como `import type {} from "mdast-util-directive"`, para tipar los nodos de directiva.

## Recompilación

Editar la configuración, o cualquier archivo local que importe, como `plugins/remark-hello.ts`, reinicia el servidor de desarrollo y recompila todos los artículos. Un plugin instalado desde npm queda en la caché junto a tus artículos, así que tras actualizarlo borra `.livemark/.cache/` para recompilar.
