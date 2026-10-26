---
title: Fumadocs vs Livemark
label: Fumadocs
description: Vite + TanStack Start frente al App Router de Next.js para documentación.
path: /comparison/fumadocs/
icon: square-dashed
order: 5
---

# Fumadocs vs Livemark

[Fumadocs](https://fumadocs.dev) es un framework de documentación basado en Next.js y construido en torno al App Router. Reparte las responsabilidades entre paquetes separados: `fumadocs-core` (lógica headless), `fumadocs-ui` (componentes de UI por defecto) y `fumadocs-mdx` (cargador de fuentes de contenido).

## De un vistazo [#at-a-glance]

| Eje                        | Livemark                                     | Fumadocs                            |
| -------------------------- | -------------------------------------------- | ----------------------------------- |
| Lenguaje / runtime         | TypeScript / Node 24+                        | TypeScript / Node 18+               |
| Framework de UI            | React 19                                     | React 18/19 (App Router de Next.js) |
| Herramienta de compilación | Vite + TanStack Start                        | Next.js (Turbopack/Webpack)         |
| Formato de contenido       | Markdown + MDX                               | Markdown + MDX                      |
| Licencia                   | MIT, autoalojado                             | MIT, autoalojado                    |
| Modelo de salida           | Estático prerenderizado (compatible con SSR) | Estático o SSR (modos de Next.js)   |

## Arquitectura [#architecture]

Livemark envuelve Vite + TanStack Start. Las rutas, el prerenderizado y la sobrescritura de componentes provienen de TanStack Start; Livemark añade content-collections para cargar el contenido y una capa por defecto de barra lateral, layout y componentes por encima.

Fumadocs da por hecho que ya tienes (o quieres) una aplicación Next.js. No es una CLI autónoma: generas un proyecto Next, instalas los paquetes de Fumadocs y conectas `fumadocs-core` y `fumadocs-ui` a tu App Router. El contenido lo lee `fumadocs-mdx` a partir de archivos `.md`/`.mdx` y lo expone como objetos tipados.

La división en paquetes es intencionada: `fumadocs-core` expone hooks y primitivas sin UI, de modo que los proyectos pueden sustituir `fumadocs-ui` por una UI propia sin hacer un fork.

La organización del contenido no tiene restricciones en el lado de Livemark: escanea por glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo la define un campo `path:` del frontmatter en lugar de su ubicación en disco. No hay una carpeta `docs/` obligatoria: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de los paquetes o de cualquier otro lugar. Fumadocs lee desde un único directorio de contenido configurado (definido en el plugin de origen de `fumadocs-mdx`); las rutas se derivan de las rutas de archivo bajo esa raíz.

## Superficie de contenido [#content-surface]

Ambas herramientas aceptan Markdown + MDX con frontmatter y componentes de React incrustados.

Fumadocs usa `fumadocs-mdx` (un cargador MDX propio) que produce objetos de contenido tipados en TypeScript con IntelliSense completo para el frontmatter. Los componentes personalizados conviven con el código de tu app Next.

Livemark usa content-collections internamente con el mismo fin: frontmatter validado (mediante esquemas Zod) y exportaciones de artículos tipadas.

La forma del frontmatter difiere: Fumadocs usa `title`, `description`, `icon`, `full`. Livemark usa `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                   | Livemark                                           | Fumadocs                                              |
| --------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)         | Parcial (mediante fuentes de contenido separadas)     |
| Internacionalización (i18n) | Sí (integrada)                                     | Sí (integrada)                                        |
| Búsqueda                    | Sí (Orama, en el cliente)                          | Sí (basada en Orama, Algolia opcional)                |
| Renderizado de OpenAPI      | No                                                 | Sí (`fumadocs-openapi`)                               |
| Blog                        | Sí (tipo de sección integrado)                     | No (usa rutas de Next)                                |
| Registro de cambios         | Sí (tipo de sección)                               | No                                                    |
| Sitemap                     | Sí                                                 | Mediante `sitemap.ts` de Next.js                      |
| RSS                         | Sí (por sección de blog)                           | Mediante rutas de Next.js                             |
| Temas                       | Sobrescritura de componentes mediante `.livemark/` | Sustituir `fumadocs-ui` o sobrescribir por componente |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)              | Cualquier página del App Router de Next               |
| CLI independiente           | Sí (`livemark build`)                              | No (comandos de Next.js)                              |

## Salida y despliegue [#output--deployment]

Livemark prerenderiza cada ruta en tiempo de compilación. La salida es un directorio estático que puedes desplegar en cualquier sitio: consulta [Despliegue](/es/deployment/).

Fumadocs hereda los modos de salida de Next.js: exportación estática completa (`output: 'export'`), SSG/SSR híbrido o totalmente dinámico. El despliegue se ajusta a lo que admita Next.js: Vercel es el destino por defecto, pero funciona cualquier host de Node o Cloudflare Workers (mediante OpenNext).

## Ver también [#see-also]

- [Autoría](/es/authoring/): la superficie de Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
