---
description: Organiza los artículos en secciones de Docs, Blog y registro de cambios.
path: /customization/article-sections/
icon: layout-panel-left
order: 3
---

# Secciones de artículos

Una sección es un grupo de artículos que comparten un prefijo de URL, una barra lateral y una pestaña de navegación. Livemark incluye tres tipos de sección:

- **Article**: el tipo por defecto. Un árbol de artículos con una barra lateral plegable.
- **Blog**: entradas ordenadas por fecha con etiquetas y un índice generado automáticamente.
- **Changelog**: un único archivo fuente (o las releases de GitHub) dividido en un artículo por versión.

## Uso básico [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "CHANGELOG.md",
      version: true,
    },
  ],
})
```

Si se omite `sections`, todos los artículos se renderizan en una única sección por defecto, algo útil para sitios pequeños.

## Campos comunes [#common-fields]

Toda sección, sea del tipo que sea, acepta:

| Campo      | Tipo                                 | Por defecto   | Propósito                                                                                                    |
| ---------- | ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `title`    | `string`                             | —             | Etiqueta de la pestaña de la sección y de la cabecera de la barra lateral.                                   |
| `prefix`   | `string`                             | —             | Prefijo de URL (p. ej. `/`, `/blog/`, `/changelog/`). Los artículos con `path` coincidentes se enrutan aquí. |
| `type`     | `"article" \| "blog" \| "changelog"` | `"article"`   | Tipo de sección.                                                                                             |
| `icon`     | `string`                             | según el tipo | Icono de Lucide mostrado junto al título.                                                                    |
| `position` | `"header" \| "sidebar"`              | `"header"`    | Dónde se renderiza la pestaña de la sección.                                                                 |

Cuando las secciones y los enlaces de la cabecera no caben, el campo de búsqueda se reduce a un icono y después los que siguen sin caber se agrupan en un menú **Más**.

En móvil, todas las secciones se pliegan en la barra lateral. Dentro de una sección se convierten en un selector que abre una hoja inferior: al elegir una, la barra lateral muestra los artículos, entradas o versiones de esa sección sin salir de la página actual.

## Secciones de artículos [#article-sections]

Documentación simple. La barra lateral muestra el árbol de artículos. Es el tipo por defecto, así que puedes omitir `type` por completo:

```typescript
{ title: "Docs", prefix: "/" }
```

## Secciones de blog [#blog-sections]

Las secciones de blog ordenan los artículos por `date` (los más recientes primero), renderizan un índice generado automáticamente en el prefijo de la sección y ofrecen páginas por etiqueta.

```typescript
{
  title: "Blog",
  prefix: "/blog/",
  type: "blog",
}
```

Luego, en cada entrada:

```yaml
---
title: Announcing v0.3
date: 2026-04-15
tags: [announcement, release]
---
```

Livemark genera automáticamente:

- `/blog/`: índice con todas las entradas, las más recientes primero.
- `/blog/tags/<tag>/`: una página por etiqueta.

## Secciones de registro de cambios [#changelog-sections]

Una sección de registro de cambios lee de un archivo `source`. Con `version: true`, Livemark divide el archivo en un artículo por cada encabezado semver.

```typescript
{
  title: "Changelog",
  prefix: "/changelog/",
  type: "changelog",
  source: "CHANGELOG.md",
  version: true,
}
```

Con `version: true`, los encabezados semver de nivel superior como `## 0.3.0 — 2026-04-01` se convierten en artículos individuales en `/changelog/0-3-0/`. La cabecera de la sección en la interfaz del sitio muestra la última versión entre paréntesis.

Un sitio puede declarar varias secciones de registro de cambios —por ejemplo, una por paquete en un monorepo— siempre que cada una tenga su propio `prefix`. Cada una renderiza sus propias páginas de versión bajo su prefijo, su propia lista de versiones en la barra lateral y su propia última versión, de modo que dos registros de cambios que contengan `0.2.0` producen `/changelog/0-2-0/` y `/python/changelog/0-2-0/` uno al lado del otro.

```typescript
sections: [
  {
    title: "Changelog",
    prefix: "/changelog/",
    type: "changelog",
    source: "CHANGELOG.md",
  },
  {
    title: "Python Changelog",
    prefix: "/python/changelog/",
    type: "changelog",
    source: "python/CHANGELOG.md",
  },
]
```

Campos específicos del registro de cambios:

| Campo     | Tipo      | Por defecto | Propósito                                                                        |
| --------- | --------- | ----------- | -------------------------------------------------------------------------------- |
| `source`  | `string`  | —           | Ruta al archivo fuente del registro de cambios, relativa a la raíz del proyecto. |
| `version` | `boolean` | `false`     | Si es true, divide `source` en un artículo por versión.                          |

## Orden y coincidencia [#ordering-and-matching]

Las rutas de los artículos se asignan a las secciones por el prefijo más largo. Dado `/blog/2024/launch/` y secciones con prefijos `/` y `/blog/`, el artículo se coloca en `/blog/`.

Termina los prefijos con barra (`/blog/`, no `/blog`) para que la coincidencia sea predecible.

## Ver también [#see-also]

- [Enlaces externos](/es/customization/external-links/): añade enlaces externos junto a las pestañas de tus secciones.
- [Frontmatter](/es/authoring/frontmatter/): los campos `path`, `order`, `group`, `date` y `tags` que determinan el contenido de las secciones.
