---
description: Añade URL externas a la cabecera o a la barra lateral.
path: /customization/external-links/
icon: external-link
order: 5
---

# Enlaces externos

El array `links` añade URL externas a la cabecera o a la barra lateral. Cada entrada se renderiza como un enlace con un icono opcional.

## Uso básico [#basic-usage]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  links: [
    {
      url: "https://github.com/acme/docs",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## Campos [#fields]

| Campo      | Tipo                    | Por defecto | Propósito                                                                     |
| ---------- | ----------------------- | ----------- | ----------------------------------------------------------------------------- |
| `url`      | `string`                | —           | URL externa.                                                                  |
| `title`    | `string`                | —           | Etiqueta visible.                                                             |
| `icon`     | `string`                | —           | Nombre de icono de Lucide (p. ej. `github`, `twitter`, `mail`).               |
| `prefix`   | `string`                | —           | Prefijo de ruta de una sección; si se define, el enlace solo aparece en ella. |
| `position` | `"header" \| "sidebar"` | `"header"`  | Dónde se renderiza el enlace.                                                 |

Los iconos vienen de [lucide-react](https://lucide.dev/icons). Usa el nombre en kebab-case.

## Enlaces en la cabecera [#header-links]

Por defecto, los enlaces se renderizan a la derecha de las pestañas de sección en la cabecera. Solo se muestra el `icon` que definas: Livemark no añade ningún indicador propio de enlace externo.

```typescript
links: [
  { url: "https://github.com/acme/docs", title: "GitHub", icon: "github" },
  { url: "https://twitter.com/acme", title: "Twitter", icon: "twitter" },
]
```

## Enlaces en la barra lateral [#sidebar-links]

Define `position: "sidebar"` para renderizarlo dentro de la barra lateral izquierda, debajo del árbol de secciones.

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main",
    title: "Edit on GitHub",
    icon: "pencil",
    position: "sidebar",
  },
]
```

## Limitar un enlace a una sección [#scoping-a-link-to-a-section]

Usa `prefix` para mostrar un enlace solo cuando una sección concreta está activa. Es útil para accesos directos por sección como "Editar en GitHub" o "Informar de un problema".

```typescript
links: [
  {
    url: "https://github.com/acme/docs/edit/main/blog",
    title: "Edit on GitHub",
    icon: "pencil",
    prefix: "/blog/",
    position: "sidebar",
  },
]
```

## Ver también [#see-also]

- [Secciones de artículos](/es/customization/article-sections/): los valores de `prefix` a los que apunta el `prefix` de un enlace.
- [Metadatos del sitio](/es/customization/site-metadata/): el título de la marca y el logo que se sitúan junto a los enlaces de la cabecera.
