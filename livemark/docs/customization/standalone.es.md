---
description: Renderiza Markdown con el pipeline y los componentes de Livemark dentro de tu propia app de Vite o TanStack Start.
icon: package
order: 13
---

# Markdown independiente

El pipeline de Markdown y los componentes de artículo de Livemark se publican por separado como `@livemark/vite`. Una app basada en Vite, como una app de TanStack Start con un blog, puede importar archivos `.md` y `.mdx` y renderizarlos con los mismos callouts, pestañas, bloques de código y tarjetas que un artículo de Livemark, sin instalar Livemark.

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
