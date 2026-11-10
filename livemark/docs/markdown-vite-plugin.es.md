---
description: Renderiza Markdown con el pipeline y los componentes de Livemark dentro de tu propia app de Vite y React.
label: Plugin de Vite
icon: package
order: 7
---

# Plugin de Vite para Markdown

El pipeline de Markdown y los componentes de artículo de Livemark se publican por separado como `@livemark/vite`. Cualquier app de React basada en Vite puede importar archivos `.md` y `.mdx` y renderizarlos con los mismos callouts, pestañas, bloques de código y tarjetas que un artículo de Livemark, sin instalar Livemark.

```bash
npm install @livemark/vite
```

## El plugin de Vite

```ts title="vite.config.ts"
import markdown from "@livemark/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [markdown()],
})
```

Cada archivo `.md` o `.mdx` importado se convierte en un módulo que exporta:

- `default`: el contenido como componente de React, renderizado con los componentes de Livemark
- `frontmatter`: el frontmatter YAML del archivo
- `toc`: sus encabezados h2 a h4 como `{ url, title, depth }`

Un archivo se compila como Livemark compila un artículo: `.md` como Markdown, `.mdx` como MDX, y un `format: md` o `format: mdx` en su frontmatter prevalece sobre la extensión.

| Opción               | Por defecto        | Qué hace                                                                   |
| -------------------- | ------------------ | -------------------------------------------------------------------------- |
| `include`            | `/\.mdx?$/`        | Los ids de módulo a compilar, como globs o expresiones regulares           |
| `exclude`            |                    | Los ids de módulo que se dejan intactos                                    |
| `codeThemeLight`     | `catppuccin-latte` | El [tema de sintaxis](/es/customization/syntax-themes/) en modo claro      |
| `codeThemeDark`      | `catppuccin-mocha` | El tema de sintaxis en modo oscuro                                         |
| `plugins`            |                    | [Plugins](/es/customization/plugins/) `{ md, html }`, como en un sitio     |
| `allowDangerousHtml` | `true`             | `false` elimina todo el HTML y falla con cualquier archivo que sería MDX   |
| `root`, `base`       |                    | Resuelve las URLs relativas de imágenes desde `root` y las sirve en `base` |
| `collections`        |                    | Colecciones servidas como módulos virtuales                                |

Usa `allowDangerousHtml: false` para contenido en el que no confías del todo: Markdown no puede ejecutar código, MDX sí. React bloquea los enlaces con una URL `javascript:` al renderizar el contenido. El plugin también avisa, a través de Vite, de lo que se renderiza mal en silencio, como una directiva desconocida.

Para TypeScript, referencia los tipos de los módulos una vez:

```ts title="env.d.ts"
/// <reference types="@livemark/vite/env" />
```

## Renderizado

```tsx title="routes/blog/post.tsx"
import { MessagesProvider } from "@livemark/vite/react"
import Post from "./post.md"

export function PostPage() {
  return (
    <MessagesProvider messages={{ "callout.note": "Nota" }}>
      <article className="prose dark:prose-invert">
        <Post />
      </article>
    </MessagesProvider>
  )
}
```

Pasa `components` para reemplazar cualquiera de los componentes de Livemark en un renderizado, como `<Post components={{ a: RouterLink }} />`.

- **`MessagesProvider`** proporciona los textos de interfaz que muestran los componentes, como los títulos de los callouts y la etiqueta del botón de copiar. Una clave que omitas queda en inglés. Las claves son las de [`messages`](/es/customization/translations/) de un idioma.
- **`IconsProvider`** de `@livemark/vite/react` proporciona los iconos que renderizan `:icon` y `:::card{icon}`, por su clave de Lucide: pasa `icons` de lucide-react o un subconjunto. Sin él, no se renderiza ningún icono.

## Colecciones

El índice de un blog, una página de etiqueta o un sitemap necesitan el frontmatter de cada artículo sin cargar todos los artículos. Una colección lista un conjunto de archivos sin su contenido y carga cada contenido cuando hace falta:

```ts title="vite.config.ts"
import markdown, { defineCollection } from "@livemark/vite"
import { defineConfig } from "vite"
import { Post } from "./post.ts"

export const blog = defineCollection({
  name: "blog",
  include: "content/blog/**/*.md",
  schema: Post,
})

export default defineConfig({
  plugins: [markdown({ collections: [blog] })],
})
```

La aplicación la importa como `virtual:livemark/collection/<name>`:

```tsx title="routes/blog/post.tsx"
import { lazy } from "react"
import { entries, load } from "virtual:livemark/collection/blog"

const posts = entries.map(entry => ({ ...entry, Body: lazy(() => load(entry.id)) }))
```

- **`entries`** lista cada archivo, ordenado por ruta, como `{ id, file, frontmatter, readingTime }`. `readingTime` está en minutos, a 200 palabras por minuto y sin contar los bloques de código. No incluye contenidos, así que un índice sigue siendo ligero.
- **`load(id)`** importa el módulo compilado de una entrada, el mismo que da importar el archivo. Cada archivo es su propio chunk, y un id desconocido rechaza la promesa.

| Opción    | Por defecto              | Qué hace                                                                         |
| --------- | ------------------------ | -------------------------------------------------------------------------------- |
| `name`    |                          | El nombre del módulo: letras, dígitos, `_` y `-`                                 |
| `include` |                          | Los archivos `.md` y `.mdx`, como globs relativos a `root`                       |
| `exclude` |                          | Los archivos excluidos, como globs relativos a `root`                            |
| `root`    | el directorio de trabajo | El directorio desde el que cuentan los globs y `file`                            |
| `schema`  |                          | Valida el frontmatter de cada archivo: un esquema de zod o cualquier `{ parse }` |
| `id`      | `file` sin su extensión  | El id de una entrada a partir de su `file`, p. ej. `file => file.split("/")[2]`  |

Un frontmatter que no supera `schema` hace fallar el build y nombra el archivo, igual que un id que comparten dos archivos. `entries` se serializa como JSON, así que un esquema que convierte una fecha en `Date` da un string en la aplicación.

`blog.list()` devuelve las mismas entradas desde Node, sin Vite: una configuración puede enumerar con ella las páginas que prerenderizar. Los archivos de una colección se compilan aunque el `include` o el `exclude` del plugin los dejen fuera. En el servidor de desarrollo, una edición que cambia `entries` recarga la página, mientras que una edición del contenido se actualiza como siempre.

Para tipar el frontmatter, declara el módulo una vez, junto a la referencia de tipos:

```ts title="env.d.ts"
declare module "virtual:livemark/collection/blog" {
  import type { CollectionEntry, MarkdownModule } from "@livemark/vite"
  import type { Post } from "./post.ts"
  export const entries: CollectionEntry<Post>[]
  export function load(id: string): Promise<MarkdownModule>
}
```

## Estilos

Los componentes se distribuyen como código fuente, así que tu build de Tailwind CSS v4 compila sus clases. Una hoja de estilos carga los estilos de Markdown y apunta Tailwind a los componentes:

```css title="app.css"
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@livemark/vite/styles.css";
@custom-variant dark (&:is(.dark *));
```

Los componentes usan estos tokens de tema, que tu CSS define como `--color-*` bajo `@theme` (consulta [los valores de Livemark](https://github.com/datisthq/livemark/blob/main/markdown/source/styles/general.css)):

- `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`
- `primary`, `secondary`, `muted`, `accent`, cada uno con su `-foreground`
- `border`, `input`, `ring`
- `positive`, `warning` y `destructive`, cada uno con `-tint` y `-tint-foreground`

Sus esquinas usan la escala `rounded-card` y `rounded-control` que define la hoja de estilos.
