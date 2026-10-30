---
title: Versionado
description: Publica documentación de varias versiones en paralelo con secciones o despliegues separados.
path: /customization/versioning/
icon: git-branch
order: 9
---

# Versionado

Livemark no tiene una función de versionado dedicada: las piezas que ya ofrece cubren los dos casos habituales. Elige según lo distintas que sean tus versiones:

- **Un sitio, una sección por versión**: unas pocas versiones cuya documentación vive en una misma rama.
- **Un despliegue por versión**: versiones mayores de larga duración mantenidas en sus propias ramas.

La mayoría de los proyectos solo necesitan mantener la documentación más reciente y la de la versión mayor anterior. Si de las versiones antiguas solo necesitas las notas, basta con una [sección de registro de cambios](/es/customization/article-sections/#changelog-sections).

## Una sección por versión {#a-section-per-version}

Guarda los artículos de cada versión antigua en su propia carpeta y dales `path`s bajo un prefijo de versión. La documentación actual se queda en `/` y cada versión antigua se convierte en una sección:

```text
docs/
  getting-started.md   # path: /getting-started/
v1/
  getting-started.md   # path: /v1/getting-started/
```

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "Acme",
  include: ["docs/**/*.md", "v1/**/*.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "v1",
      prefix: "/v1/",
      icon: "archive",
      siteTitle: "Acme v1",
    },
  ],
})
```

La coincidencia por prefijo más largo envía cada artículo `/v1/…` a la sección `v1`, que obtiene su propio árbol en la barra lateral mientras el resto del sitio mantiene la documentación actual. `siteTitle` cambia la marca junto al logo dentro de esa sección, para que el lector siempre vea en qué versión está. Define `position: "sidebar"` para sacar las pestañas de versión de la cabecera.

Para avisar a los lectores en las páginas antiguas, empieza cada una con un aviso:

```markdown
:::warning
You are reading the docs for v1. [See the latest version](/getting-started/).
:::
```

Conviene saber:

- La búsqueda indexa todo el sitio, así que los resultados incluyen los artículos de todas las versiones.
- Copiar una carpeta por versión duplica contenido; congela la carpeta antigua y corrígela solo cuando sea necesario.

## Un despliegue por versión {#one-deploy-per-version}

Cuando cada versión mayor vive en su propia rama (`main`, `v1`, …), compila cada rama como un sitio independiente y sírvelo desde su propia dirección: un subdominio (`v1.docs.example.com`) o una subruta (`docs.example.com/v1/`) con [`base`](/es/deployment/github-pages/#configure-base-for-project-sites).

```typescript title="livemark.config.ts (v1 branch)"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://docs.example.com/v1",
  base: command => (command === "build" ? "/v1" : undefined),
  title: "Acme v1",
  banner: "You are reading the v1 docs · [Go to the latest →](https://docs.example.com/)",
  include: "docs/**/*.md",
})
```

Enlaza los despliegues entre sí con una sección `custom` o un [enlace](/es/customization/external-links/) en la cabecera, que hace de selector de versión:

```typescript title="livemark.config.ts (main branch)"
sections: [
  { title: "Docs", prefix: "/" },
  { title: "v1", type: "custom", url: "https://docs.example.com/v1/", icon: "archive" },
]
```

Cada despliegue tiene su propio índice de búsqueda, sitemap y `llms.txt`, así que las versiones nunca se mezclan. El coste es una compilación y un job de CI por cada rama mantenida; consulta [Despliegue](/es/deployment/) para configurar el hosting. La mayoría de los hostings despliegan las ramas en sus propias URL sin configuración adicional.

## Ver también {#see-also}

- [Secciones de artículos](/es/customization/article-sections/): tipos de sección, prefijos y coincidencia.
- [Metadatos del sitio](/es/customization/site-metadata/): los campos `banner`, `title` y `site` usados arriba.
