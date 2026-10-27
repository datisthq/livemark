---
title: VitePress vs Livemark
label: VitePress
description: Dos frameworks de documentación nativos de Vite y centrados en Markdown, sobre stacks de UI distintos.
path: /comparison/vitepress/
icon: zap
order: 2
---

# VitePress vs Livemark

[VitePress](https://vitepress.dev) es el framework oficial de documentación de Vue, construido sobre Vite. Está centrado en Markdown, incluye un tema por defecto minimalista y es lo que impulsa la mayor parte de la documentación del ecosistema Vue (el propio Vue, Vite, Pinia, …).

## De un vistazo [#at-a-glance]

| Eje                             | Livemark                                     | VitePress                             |
| ------------------------------- | -------------------------------------------- | ------------------------------------- |
| Lenguaje / entorno de ejecución | TypeScript / Node 24+                        | TypeScript / Node 18+                 |
| Framework de UI                 | React 19                                     | Vue 3                                 |
| Herramienta de compilación      | Vite + TanStack Start                        | Vite (pipeline de compilación propio) |
| Formato de contenido            | Markdown + MDX                               | Markdown con plantillas de Vue        |
| Licencia                        | MIT, autoalojado                             | MIT, autoalojado                      |
| Modelo de salida                | Estático prerenderizado (compatible con SSR) | Estático prerenderizado (SSG)         |

## Arquitectura [#architecture]

Ambas herramientas son nativas de Vite. La diferencia está en todo lo que hay por encima de Vite: Livemark añade TanStack Start (router + funciones de servidor + pipeline de prerenderizado) y renderiza React; VitePress envuelve Vite con su propio pipeline SSG y renderiza Vue.

El entorno de ejecución de VitePress es `vue-router` más un tema por defecto integrado. Livemark usa TanStack Router e incluye su propia capa de componentes (barra lateral, diseño, búsqueda) que los proyectos pueden sobrescribir archivo a archivo mediante `.livemark/`.

En Livemark la organización del contenido no tiene restricciones: escanea mediante glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la fije un campo `path:` del frontmatter. No hace falta una carpeta `docs/`: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de paquetes o cualquier otro lugar. VitePress espera todo el contenido bajo una única raíz de código fuente (`docs/` por defecto, configurable mediante `srcDir`), con rutas derivadas de las rutas de archivo.

## Superficie de contenido [#content-surface]

VitePress acepta Markdown con plantillas de Vue integradas: puedes usar componentes Vue y bloques `<script setup>` dentro de archivos `.md`. **No** admite MDX en el sentido de React.

Livemark acepta Markdown + MDX. Los componentes insertados son React.

Ambos admiten frontmatter para los metadatos de cada página. VitePress usa `title`, `layout`, `sidebar`, `outline`, `prev`/`next`. Livemark usa `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

Avisos/admoniciones: VitePress usa contenedores `::: tip` / `::: warning` (la misma sintaxis que las directivas `:::tip` de Livemark, evaluada por parsers distintos).

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                   | Livemark                                      | VitePress                                    |
| --------------------------- | --------------------------------------------- | -------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)    | No (soluciones de la comunidad)              |
| Internacionalización (i18n) | Sí (integrado)                                | Sí (integrado)                               |
| Búsqueda                    | Sí (Orama, en el cliente)                     | Sí (local + Algolia)                         |
| Blog                        | Sí (tipo de sección integrado)                | No (plugins de la comunidad)                 |
| Registro de cambios         | Sí (tipo de sección)                          | No                                           |
| Sitemap                     | Sí                                            | Sí                                           |
| RSS                         | Sí (por sección de blog)                      | No                                           |
| Temas                       | Sobrescritura de componentes vía `.livemark/` | Temas personalizados vía `.vitepress/theme/` |
| Plugins                     | Plugins de Vite + remark/rehype               | Plugins de Vite + plugins de markdown-it     |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)         | Rutas dinámicas mediante `paths()`           |

## Salida y despliegue [#output--deployment]

Ambos producen un directorio de HTML estático + recursos listo para cualquier hosting estático. VitePress emite en `.vitepress/dist/` por defecto; Livemark emite en `.livemark/build/client/`. El alojamiento es idéntico; consulta [Despliegue](/es/deployment/) de Livemark para las guías por hosting.

## Ver también [#see-also]

- [Redacción](/es/authoring/): la superficie Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
