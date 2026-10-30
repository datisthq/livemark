---
title: Docusaurus vs Livemark
label: Docusaurus
description: Comparativa técnica lado a lado de dos frameworks de documentación con React + MDX.
path: /comparison/docusaurus/
icon: book-text
order: 1
---

# Docusaurus vs Livemark

[Docusaurus](https://docusaurus.io) es un framework de documentación de código abierto mantenido por Meta. Renderiza contenido React + MDX mediante un pipeline de compilación basado en Webpack, incluye versionado e internacionalización de primera clase y cuenta con un amplio ecosistema de plugins.

## De un vistazo {#at-a-glance}

| Eje                        | Livemark                                     | Docusaurus              |
| -------------------------- | -------------------------------------------- | ----------------------- |
| Lenguaje / runtime         | TypeScript / Node 24+                        | TypeScript / Node 18+   |
| Framework de UI            | React 19                                     | React 18                |
| Herramienta de compilación | Vite + TanStack Start                        | Webpack                 |
| Formato de contenido       | Markdown + MDX                               | Markdown + MDX          |
| Licencia                   | MIT, autoalojado                             | MIT, autoalojado        |
| Modelo de salida           | Estático prerenderizado (compatible con SSR) | Estático prerenderizado |

## Arquitectura {#architecture}

Livemark envuelve Vite, TanStack Start y React en una única CLI sin configuración. El contenido lo carga content-collections a partir de archivos `.md` seleccionados por glob, se compila como Markdown, o como MDX en los archivos `.mdx`, en tiempo de compilación y se prerenderiza a HTML estático para cada ruta.

Docusaurus está construido sobre Webpack. El runtime es React Router + un núcleo de Docusaurus que gestiona los temas, los plugins y las fuentes de contenido. Los plugins son de primera clase: cada funcionalidad integrada (docs, blog, páginas, búsqueda) es en sí misma un plugin, y los terceros extienden el sistema de la misma forma.

La organización del contenido no tiene restricciones en el lado de Livemark: escanea por glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la defina un campo `path:` del frontmatter. No hay una carpeta `docs/` obligatoria: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de los paquetes o de cualquier otro lugar. El plugin de docs de Docusaurus espera un directorio `docs/` (configurable mediante `path`, pero basado en carpetas en lugar de en globs).

## Superficie de contenido {#content-surface}

Ambas herramientas aceptan Markdown y MDX con frontmatter. Ambas permiten incrustar componentes de React dentro de archivos `.mdx`.

Las directivas de Livemark (`:::card`, `:::tip`, `:::tab`, …) las compila textlane, el pipeline de Markdown en Rust que ejecuta Livemark. Docusaurus usa componentes MDX más una extensión `admonition` para los avisos.

La forma del frontmatter difiere: Livemark usa `path`, `order`, `icon`, `sidebar`, `date`, `tags`. Docusaurus usa `id`, `slug`, `sidebar_position`, `sidebar_label`, `tags`.

## Matriz de funcionalidades {#feature-matrix}

| Capacidad                   | Livemark                                               | Docusaurus                               |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)             | Sí (integrado)                           |
| Internacionalización (i18n) | Sí (integrada)                                         | Sí (integrada)                           |
| Búsqueda                    | Sí (Orama, en el cliente)                              | Integración con Algolia DocSearch        |
| Blog                        | Sí (tipo de sección integrado)                         | Sí (plugin integrado)                    |
| Registro de cambios         | Sí (tipo de sección, divide por encabezado de versión) | No (plugins de la comunidad)             |
| Sitemap                     | Sí                                                     | Sí                                       |
| RSS                         | Sí (por sección de blog)                               | Sí (para el plugin de blog)              |
| Temas                       | Sobrescritura de componentes mediante `.livemark/`     | Paquetes de tema (`@docusaurus/theme-*`) |
| Plugins                     | Plugins de Vite + textlane                             | API de plugins de primera clase          |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)                  | Rutas definidas por plugins              |

## Salida y despliegue {#output--deployment}

Livemark prerenderiza cada ruta en disco en `.livemark/build/client/`: consulta [Despliegue](/es/deployment/) para ver guías específicas por proveedor.

Docusaurus también prerenderiza a HTML estático, con salida en `build/`. La salida estática funciona en los mismos proveedores (GitHub Pages, Cloudflare, Vercel, Netlify, hosting estático). La i18n integrada de Docusaurus produce árboles de salida separados por idioma.

## Ver también {#see-also}

- [Autoría](/es/authoring/): la superficie de Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
