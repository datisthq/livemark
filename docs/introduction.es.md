---
title: Introducción
description: Aprende a configurar tu primer proyecto Livemark.
icon: rocket
path: /introduction/
order: 1
---

Livemark convierte Markdown simple en un sitio de documentación rápido y moderno. Apúntalo a una carpeta de archivos `.md` y te da un sitio React + Vite desplegable con búsqueda, resaltado de sintaxis, secciones de blog y registro de cambios, modo oscuro y una biblioteca de componentes personalizable, todo integrado.

## Lo que obtienes [#what-you-get]

- **Solo escribe Markdown.** El Markdown al estilo GitHub funciona de serie, con frontmatter, IDs de encabezado personalizados, notas al pie, listas de definiciones y gemoji.
- **Bloques de código preciosos.** Resaltado de sintaxis con [Shiki](https://shiki.style/) para más de 100 lenguajes, temas duales claro/oscuro, líneas resaltadas, diffs y pistas de tipos con TwoSlash.
- **Diagramas y matemáticas.** Diagramas de flujo de [Mermaid](https://mermaid.js.org/) y ecuaciones de KaTeX, adaptados al tema y sin configuración.
- **Elementos enriquecidos.** Avisos, pestañas, árboles de archivos, tarjetas, columnas, insignias, pestañas de paquetes (npm/pnpm/yarn/bun), contenido incrustado (YouTube, SoundCloud) y más, todo como directivas de Markdown o componentes MDX.
- **Secciones.** Soporte de primera clase para documentación, blog (con etiquetas + RSS) y registro de cambios (un `CHANGELOG.md` local o las releases de GitHub).
- **Búsqueda.** Búsqueda de texto completo con [Orama](https://oramasearch.com/), con las coincidencias resaltadas en la página a la que llegas, atajos de teclado y una tabla de contenidos inteligente.
- **Personalizable con temas.** Tailwind v4, primitivas al estilo shadcn, modo oscuro y sobrescrituras por archivo mediante una carpeta `.livemark/`.
- **Construido sobre TanStack Start.** SSR, prerenderizado, sitemap y enrutado gratis.

## Inicio rápido [#quick-start]

Necesitas [Node.js](https://nodejs.org/) 24+ y un gestor de paquetes (pnpm, npm, yarn o bun).

### Instalación [#install]

```bash
npm install livemark
```

### Configuración [#configure]

Crea `livemark.config.ts` en la raíz de tu proyecto:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  include: ["docs/**/*.md"],
})
```

### Añade contenido [#add-content]

```text title="docs/"
docs/
├── getting-started.md
└── usage.md
```

Cada archivo `.md` admite frontmatter:

```md title="docs/getting-started.md"
---
title: Getting Started
description: Set up the project in five minutes.
icon: rocket
order: 1
---

# Getting Started

Welcome!
```

### Ejecuta [#run]

```bash
npx livemark start    # dev server with HMR at http://localhost:8000 (--host: also on the LAN)
npx livemark build    # production build to .livemark/build/
npx livemark preview  # serve the production build locally
npx livemark clear    # wipe the generated .livemark/.serve/, .build/ and .cache/ (stop the dev server first)
```

Ese es todo el ciclo. Añade `.livemark/build/` a tu `.gitignore`.

## Estructura del proyecto [#project-structure]

Un sitio Livemark típico:

```text title="my-project/"
my-project/
├── livemark.config.ts   # configuration
├── docs/                # markdown content
├── blog/                # blog posts (optional)
├── CHANGELOG.md         # changelog source (optional)
└── .livemark/           # overrides + build cache (generated)
```

Todo lo que pongas en `.livemark/components/`, `.livemark/elements/` o `.livemark/styles/` sustituye al valor por defecto de Livemark con la misma ruta, así que puedes personalizar componentes, primitivas y CSS base sin hacer un fork del paquete. Ejecuta `npx livemark escape <path>` para copiar un archivo por defecto a `.livemark/`, listo para editar.

## Personalización [#customization]

Livemark está pensado para verse genial sin configuración y no estorbarte cuando necesitas más. Personalizaciones habituales:

- **Metadatos del sitio**: título, descripción, favicon, logo. Consulta la [guía de metadatos del sitio](/es/customization/site-metadata/).
- **Secciones**: divide el contenido en Docs / Blog / Changelog, cada una con su propio prefijo de URL. Consulta [Secciones de artículos](/es/customization/article-sections/).
- **Enlaces externos**: enlaces en la cabecera y la barra lateral a cualquier sitio. Consulta [Enlaces externos](/es/customization/external-links/).
- **Temas de sintaxis**: un tema de Shiki para claro y otro para oscuro. Consulta [Temas de sintaxis](/es/customization/syntax-themes/).
- **Parches de artículos**: sobrescribe el frontmatter de un archivo Markdown desde `livemark.config.ts` sin tocar el archivo. Consulta [Parches de artículos](/es/customization/article-patches/).
- **Escape**: sustituye cualquier componente u hoja de estilos integrados desde tu proyecto. Consulta [Escape](/es/customization/overriding-escaping/).
- **Rutas personalizadas**: coloca un archivo `.tsx` en `.livemark/routes/` para añadir una página totalmente personalizada. Consulta [Rutas personalizadas](/es/customization/custom-routes/).

## Documentación [#documentation]

La documentación completa está en **[livemark.dev](https://livemark.dev)**:

- [Referencia de autoría](/es/authoring/): cada función de Markdown / MDX con ejemplos
- [Personalización](/es/customization/): cada opción, con fragmentos listos para copiar y pegar
- [Registro de cambios](/changelog/): notas de las versiones
- [Contribuir](/es/contributing/): configuración local y flujo de PR

## Recursos [#resources]

- **npm**: [npmjs.com/package/livemark](https://www.npmjs.com/package/livemark)
- **GitHub**: [github.com/datisthq/livemark](https://github.com/datisthq/livemark)
- **Issues**: [github.com/datisthq/livemark/issues](https://github.com/datisthq/livemark/issues)
- **Discusiones**: [github.com/datisthq/livemark/discussions](https://github.com/datisthq/livemark/discussions)

## Licencia [#license]

MIT; consulta [LICENSE.md](https://github.com/datisthq/livemark/blob/main/LICENSE.md).
