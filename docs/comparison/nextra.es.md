---
title: Nextra vs Livemark
label: Nextra
description: Vite + TanStack Start frente a Next.js con el consolidado modelo de paquetes de temas.
path: /comparison/nextra/
icon: square-stack
order: 6
---

# Nextra vs Livemark

[Nextra](https://nextra.site) es un framework de documentación para Next.js con una arquitectura de paquetes de temas. Nació sobre el Pages Router y ha migrado para admitir también el App Router. Los sitios de documentación eligen un tema (`nextra-theme-docs` para documentación, `nextra-theme-blog` para blogs) y lo configuran.

## De un vistazo {#at-a-glance}

| Eje                             | Livemark                                     | Nextra                            |
| ------------------------------- | -------------------------------------------- | --------------------------------- |
| Lenguaje / entorno de ejecución | TypeScript / Node 24+                        | TypeScript / Node 18+             |
| Framework de UI                 | React 19                                     | React 18/19 (Next.js)             |
| Herramienta de compilación      | Vite + TanStack Start                        | Next.js (Turbopack/Webpack)       |
| Formato de contenido            | Markdown + MDX                               | Markdown + MDX                    |
| Licencia                        | MIT, autoalojado                             | MIT, autoalojado                  |
| Modelo de salida                | Estático prerenderizado (compatible con SSR) | Estático o SSR (modos de Next.js) |

## Arquitectura {#architecture}

Livemark es una CLI sobre Vite + TanStack Start: una herramienta, un archivo de configuración, contenido en archivos `.md`.

Nextra es una capa sobre una aplicación Next.js existente. La puesta en marcha consiste en instalar `nextra` y un paquete de tema, conectarlos en `next.config.js` y definir la navegación en un archivo `_meta.json` (Pages Router) o `meta.js` (App Router) por directorio. El paquete de tema controla toda la UI; la personalización se hace mediante los hooks documentados del tema.

`nextra-theme-docs` es el tema de documentación que usan Vercel, SWR, Turbo y muchos otros. Es estable, está mantenido y cubre todo lo necesario para documentación.

En Livemark la organización del contenido no tiene restricciones: escanea mediante glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la fije un campo `path:` del frontmatter. No hace falta una carpeta `docs/`: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de paquetes o cualquier otro lugar. Nextra lee el contenido de `pages/` (Pages Router) o `content/` (App Router), con rutas determinadas por las rutas de archivo y los archivos `_meta.json` que los acompañan.

## Superficie de contenido {#content-surface}

Ambas herramientas aceptan Markdown + MDX con frontmatter y componentes React insertados.

Nextra admite MDX remoto mediante `next-mdx-remote`, KaTeX/Mermaid mediante plugins y optimización de imágenes con el componente `<Image>` de Next.

La forma del frontmatter difiere: Nextra usa `title`, `description`, `searchable`, `hide_title`, más un `_meta.json` por directorio para la navegación. Livemark usa frontmatter en línea para todo (`path`, `order`, `icon`, `sidebar`, `date`, `tags`) y un único `livemark.config.ts` para la navegación del sitio.

## Matriz de funcionalidades {#feature-matrix}

| Capacidad                   | Livemark                                      | Nextra                                                     |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)    | No (soluciones de la comunidad)                            |
| Internacionalización (i18n) | Sí (integrado)                                | Sí (con i18n de Next + hooks de Nextra)                    |
| Búsqueda                    | Sí (Orama, en el cliente)                     | Sí (FlexSearch integrado, Algolia/Pagefind opcionales)     |
| Blog                        | Sí (tipo de sección integrado)                | Sí (`nextra-theme-blog`)                                   |
| Registro de cambios         | Sí (tipo de sección)                          | No (plugins de la comunidad)                               |
| Sitemap                     | Sí                                            | Con `sitemap.ts` de Next.js                                |
| RSS                         | Sí (por sección de blog)                      | Sí (tema de blog), con rutas de Next para la documentación |
| Temas                       | Sobrescritura de componentes vía `.livemark/` | Paquetes de temas; se personalizan con su configuración    |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)         | Cualquier página/ruta de Next                              |
| CLI propia                  | Sí (`livemark build`)                         | No (comandos de Next.js)                                   |

## Salida y despliegue {#output--deployment}

Livemark prerenderiza cada ruta en tiempo de compilación; la salida queda en `.livemark/build/client/` y se despliega en cualquier hosting estático (consulta [Despliegue](/es/deployment/)).

Nextra hereda los modos de salida de Next.js. La configuración más habitual para documentación es la exportación estática completa (`output: 'export'`), que produce un directorio estático desplegable en cualquier sitio. Las configuraciones con SSR apuntan a Vercel o a hostings de Node.

## Ver también {#see-also}

- [Redacción](/es/authoring/): la superficie Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
