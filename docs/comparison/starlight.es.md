---
title: Starlight vs Livemark
label: Starlight
description: React + TanStack Start frente a Astro Islands para documentación.
path: /comparison/starlight/
icon: star
order: 4
---

# Starlight vs Livemark

[Starlight](https://starlight.astro.build) es el tema oficial de documentación de Astro, mantenido por el equipo de Astro. Usa la arquitectura de islas de Astro (cero JavaScript por defecto, componentes interactivos opcionales) y admite contenido MDX.

## De un vistazo [#at-a-glance]

| Eje                             | Livemark                                     | Starlight                                                                    |
| ------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| Lenguaje / entorno de ejecución | TypeScript / Node 24+                        | TypeScript / Node 18+                                                        |
| Framework de UI                 | React 19                                     | Componentes Astro (HTML primero), islas opcionales de React/Vue/Svelte/Solid |
| Herramienta de compilación      | Vite + TanStack Start                        | Astro (Vite por debajo)                                                      |
| Formato de contenido            | Markdown + MDX                               | Markdown + MDX + MDoc                                                        |
| Licencia                        | MIT, autoalojado                             | MIT, autoalojado                                                             |
| Modelo de salida                | Estático prerenderizado (compatible con SSR) | Estático prerenderizado (compatible con SSR mediante adaptadores)            |

## Arquitectura [#architecture]

Livemark renderiza React en tiempo de compilación (prerenderizado) y en tiempo de ejecución (hidratación en el cliente). Cada página incluye React; la interactividad es universal.

Starlight usa el modelo de islas de Astro: las páginas se renderizan a HTML en tiempo de compilación con cero JavaScript por defecto. Los componentes interactivos son "islas" explícitas que se hidratan bajo demanda. El tema por defecto de Starlight está formado sobre todo por componentes Astro (sin JS en el cliente); recurrir a React/Vue/Svelte es opcional.

Ambos compilan con Vite. El modelo de componentes de Astro es su propia sintaxis `.astro` (HTML + frontmatter de JS, analizado estáticamente). El modelo de componentes de Livemark es React.

En Livemark la organización del contenido no tiene restricciones: escanea mediante glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo la fija un campo `path:` del frontmatter en lugar de su ubicación en disco. No hace falta una carpeta `docs/`: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de paquetes o cualquier otro lugar. Starlight exige el contenido en `src/content/docs/` (el directorio de content collections de Astro), con rutas derivadas de las rutas de archivo bajo esa raíz.

## Superficie de contenido [#content-surface]

Ambas herramientas aceptan Markdown + MDX con frontmatter.

Starlight admite además MDoc (Markdoc) para contenido estructurado y validado con etiquetas personalizadas. Los componentes en archivos `.mdx` son componentes Astro por defecto; los componentes de otros frameworks (React, etc.) necesitan directivas `client:*` explícitas para hidratarse.

Los componentes de Livemark en archivos `.mdx` son React; la hidratación es uniforme.

La forma del frontmatter difiere: Starlight usa `title`, `description`, `sidebar`, `tableOfContents`, `editUrl`, `lastUpdated`. Livemark usa `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                   | Livemark                                      | Starlight                                           |
| --------------------------- | --------------------------------------------- | --------------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)    | No (plugins de la comunidad)                        |
| Internacionalización (i18n) | Sí (integrado)                                | Sí (integrado)                                      |
| Búsqueda                    | Sí (Orama, en el cliente)                     | Sí (Pagefind, integrado)                            |
| Cero JS por defecto         | No (React se hidrata)                         | Sí (arquitectura de islas)                          |
| Blog                        | Sí (tipo de sección integrado)                | No (usa las content collections de Astro)           |
| Registro de cambios         | Sí (tipo de sección)                          | No                                                  |
| Sitemap                     | Sí                                            | Sí                                                  |
| RSS                         | Sí (por sección de blog)                      | Con la integración `@astrojs/rss`                   |
| Temas                       | Sobrescritura de componentes vía `.livemark/` | Sobrescritura de componentes vía slots de Starlight |
| Plugins                     | Plugins de Vite + remark/rehype               | Integraciones de Astro + plugins de Starlight       |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)         | Páginas de Astro junto al contenido de Starlight    |

## Salida y despliegue [#output--deployment]

Ambos producen un directorio de HTML estático + recursos. Starlight emite en `dist/` por defecto; Livemark emite en `.livemark/build/client/`. El alojamiento es igual en ambos casos; consulta [Despliegue](/es/deployment/) de Livemark para las guías por hosting.

Starlight hereda el sistema de adaptadores de Astro, que admite SSR en Cloudflare, Netlify, Vercel, Node y Deno. Livemark se apoya en los presets de Nitro de TanStack Start para los mismos despliegues dinámicos.

## Ver también [#see-also]

- [Redacción](/es/authoring/): la superficie Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
