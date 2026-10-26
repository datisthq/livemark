---
title: Frontmatter
path: /authoring/frontmatter/
icon: file-text
order: 1
---

# Frontmatter

El frontmatter YAML al principio de cada archivo `.md` añade metadatos a un artículo. Todos los campos son opcionales; cuando falta un campo, Livemark deriva valores por defecto razonables a partir del propio archivo.

```yaml
---
title: Getting Started
description: Your first Livemark project, in ten minutes.
icon: rocket
order: 1
---
```

## Metadatos del artículo [#article-metadata]

Identidad y presentación del artículo.

| Campo         | Tipo                 | Valor por defecto                               | Propósito                                                                                                   |
| ------------- | -------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `title`       | `string`             | Primer encabezado `#`, si no, nombre de archivo | Título de la pestaña del navegador, encabezado del artículo, etiqueta de navegación.                        |
| `label`       | `string`             | `title`                                         | Variante corta usada en la barra lateral y las migas de pan cuando `title` es largo.                        |
| `description` | `string`             | —                                               | `<meta name="description">` y descripción de Open Graph.                                                    |
| `icon`        | `string`             | —                                               | Nombre de icono de Lucide (p. ej. `rocket`, `book-open`). Los artículos sin icono se renderizan sin icono.  |
| `image`       | `string`             | —                                               | Imagen de Open Graph / tarjeta social (requiere `site`). Las rutas relativas se resuelven desde el archivo. |
| `author`      | `string \| string[]` | —                                               | Uno o varios nombres de autor.                                                                              |
| `date`        | `string`             | —                                               | Fecha ISO. Determina el orden en las secciones de blog.                                                     |
| `tags`        | `string[]`           | —                                               | Las secciones de blog lo usan para generar las páginas `/tags/<tag>/`.                                      |

## Ajustes de la barra lateral [#sidebar-settings]

Cómo aparece el artículo en la navegación de la izquierda.

| Campo         | Tipo      | Valor por defecto                 | Propósito                                                                                          |
| ------------- | --------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `order`       | `number`  | — (sin orden, en el medio)        | Posición de orden. Consulta "Reglas de orden" más abajo.                                           |
| `sidebar`     | `boolean` | `true`                            | Si es false, el artículo es accesible por URL pero se oculta de la navegación.                     |
| `toc`         | `boolean` | `true`                            | Si es false, oculta el índice de la derecha.                                                       |
| `breadcrumbs` | `boolean` | `breadcrumbs` de la configuración | Si es false, oculta la ruta sobre el título; true la muestra aunque la configuración la desactive. |

### Reglas de orden [#ordering-rules]

`order` usa un esquema de dos regiones:

- Un `order` positivo va primero, en orden ascendente (`order: 1`, `2`, `3`, …).
- Los artículos sin `order` van después, en orden natural.
- Un `order` negativo va al final, con `-1` el último, `-2` el penúltimo, etc.

Así puedes fijar "Primeros pasos" arriba (`order: 1`) y "Preguntas frecuentes" abajo (`order: -1`) sin tocar el resto.

## URL [#url]

| Campo      | Tipo     | Valor por defecto                                              | Propósito                                                                          |
| ---------- | -------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `path`     | `string` | Nombre de archivo convertido en slug bajo la raíz del proyecto | Sobrescribe el slug de la URL. Incluye las barras inicial y final.                 |
| `language` | `string` | Sufijo de archivo `.<code>.md`, si no, el idioma por defecto   | El idioma del artículo en un [sitio multilingüe](/es/customization/translations/). |

## Sobrescribir sin editar [#overriding-without-editing]

Si no puedes modificar el frontmatter de un archivo (por ejemplo, un `README.md` que también sirve de portada en GitHub), puedes inyectar los mismos campos desde `livemark.config.ts` mediante [Article Patches](/es/customization/article-patches/).

## Ver también [#see-also]

- [Article Sections](/es/customization/article-sections/) — cómo interactúan `order` y `date` con las secciones de blog y de registro de cambios.
- [Article Patches](/es/customization/article-patches/) — define el frontmatter desde la configuración, sin tocar el archivo.
