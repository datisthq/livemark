---
title: Metadatos del sitio
description: Define el título, la descripción, la URL, el logo, el favicon y el banner del sitio.
path: /customization/site-metadata/
icon: globe
order: 2
---

# Metadatos del sitio

Unos pocos campos de nivel superior en `livemark.config.ts` describen tu sitio a los navegadores, los buscadores y las tarjetas para redes sociales.

## Campos {#fields}

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  site: "https://example.com",
  title: "My Docs",
  description: "Everything you need to build things.",
  logo: "/logo.svg",
  favicon: "/favicon.ico",
  banner: "v2 is out · [Read the release notes](/blog/v2/)",
  head: { meta: [{ name: "twitter:site", content: "@me" }] },
})
```

| Campo         | Tipo     | Por defecto                 | Dónde aparece                                                               |
| ------------- | -------- | --------------------------- | --------------------------------------------------------------------------- |
| `site`        | `string` | —                           | Origen canónico usado por el sitemap y las URL absolutas                    |
| `title`       | `string` | `"Livemark"`                | `<title>`, `og:title` de Open Graph, título del sitio en la cabecera        |
| `description` | `string` | `"Markdown site generator"` | `<meta name="description">`, `og:description`                               |
| `logo`        | `string` | —                           | Imagen junto al título del sitio en la cabecera (y favicon por defecto)     |
| `favicon`     | `string` | `logo ?? bundled default`   | Icono de la pestaña del navegador                                           |
| `banner`      | `string` | —                           | Franja de anuncio sobre la cabecera en todas las páginas                    |
| `head`        | `object` | —                           | `meta`, `links` y `scripts` adicionales en el `<head>` de todas las páginas |

## Sitemap y `site` {#sitemap-and-site}

Si `site` está definido, Livemark genera un `sitemap.xml` en la raíz de tu salida durante `livemark build`, usando `site` como origen absoluto de cada URL. Sin `site`, se omite la generación del sitemap.

## Logo y favicon {#logo-and-favicon}

- `logo` y `favicon` aceptan cualquier URL o ruta relativa a la raíz (`/logo.svg`). Los recursos colocados en `.livemark/public/` se sirven en `/…` y funcionan bien aquí.
- Si se omite `favicon`, Livemark recurre a `logo` y, por último, a su marca incluida.
- El tipo MIME se deduce de la extensión (`.svg`, `.png`, `.ico`).

:::tip
Mantén pequeño el archivo de `logo` (lo ideal es un SVG). Se incrusta en la cabecera de todas las páginas.
:::

## Banner {#banner}

`banner` muestra una franja a todo lo ancho sobre la cabecera en todas las páginas; desaparece al desplazarte mientras la cabecera permanece fija. El valor es Markdown en línea —enlaces, `**bold**`, `_emphasis_` y `` `code` ``—, así que un anuncio de una línea no necesita ningún componente personalizado:

```typescript title="livemark.config.ts"
banner: "Livemark is in technical preview · [Share feedback →](https://github.com/datisthq/livemark/discussions)",
```

- Los enlaces absolutos se abren en una pestaña nueva; los relativos a la raíz reciben tu prefijo `base`.
- Las etiquetas HTML sin procesar se descartan. Para iconos o marcado personalizado, escapa `components/Banner.tsx` en su lugar ([Sobrescritura/Escape](/es/customization/overriding-escaping/)).
- La franja usa los tokens de color `--banner` y `--banner-foreground`.

## Etiquetas por página {#per-page-tags}

Cada página de artículo sobrescribe los valores por defecto del sitio con sus propios `<title>`, `description`, `og:title`, `og:description` y `og:type` (`article`). Con `site` definido, también recibe `og:url`, un `<link rel="canonical">` y, a partir del `image` del frontmatter, un `og:image` absoluto.

## Etiquetas head adicionales {#extra-head-tags}

`head` añade etiquetas a todas las páginas, después de las predeterminadas. Una entrada `meta` con el mismo `name` o `property` que una predeterminada la reemplaza:

```typescript title="livemark.config.ts"
export default defineConfig({
  head: {
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "abc123" },
    ],
    links: [{ rel: "me", href: "https://mastodon.social/@me" }],
    scripts: [{ src: "https://example.com/analytics.js", defer: "" }],
  },
})
```

Para eliminar o reescribir una etiqueta predeterminada, escapa `head.ts` y edita lo que devuelve `customizeHead`:

```typescript title=".livemark/head.ts"
import type { RootHead } from "livemark"

export function customizeHead(head: RootHead) {
  head.meta = head.meta.filter(m => m.property !== "og:site_name")
  return head
}
```

## Ver también {#see-also}

- [Enlaces externos](/es/customization/external-links/): enlaces de cabecera y barra lateral que viven junto al título.
- [Secciones de artículos](/es/customization/article-sections/): cómo estructurar el contenido del propio sitio.
