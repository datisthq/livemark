---
title: Docsify vs Livemark
label: Docsify
description: Generador de sitios estáticos frente a renderizador de Markdown en tiempo de ejecución en el navegador.
path: /comparison/docsify/
icon: wind
order: 9
---

# Docsify vs Livemark

[Docsify](https://docsify.js.org) es una herramienta para sitios de documentación con un enfoque distinto al de cualquier otra entrada de esta sección: no genera HTML estático en tiempo de compilación. En su lugar, distribuye un único `index.html` más un runtime de JavaScript que descarga archivos Markdown en el navegador y los renderiza al vuelo. No hay paso de compilación.

## De un vistazo {#at-a-glance}

| Eje                        | Livemark                                     | Docsify                                                       |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| Lenguaje / runtime         | TypeScript / Node 24+                        | JavaScript en el navegador (sin compilación)                  |
| Framework de UI            | React 19                                     | JS vanilla + directivas de plantilla al estilo Vue            |
| Herramienta de compilación | Vite + TanStack Start                        | Ninguna (descarga + renderizado en tiempo de ejecución)       |
| Formato de contenido       | Markdown + MDX                               | Markdown (marked / Prism en el navegador)                     |
| Licencia                   | MIT, autoalojado                             | MIT, autoalojado                                              |
| Modelo de salida           | Estático prerenderizado (compatible con SSR) | Renderizado en el cliente a partir de archivos `.md` en bruto |

## Arquitectura {#architecture}

Livemark se apoya en Vite, TanStack Start y React. La autoría sigue las convenciones de JS/TS (`livemark.config.ts`, plugins instalables con npm, componentes MDX escritos en React). Las páginas se prerenderizan a HTML estático en tiempo de compilación y también pueden ejecutarse en el servidor.

Docsify no tiene pipeline de compilación. Un sitio es un `index.html` que carga `docsify.js` desde una CDN (o `node_modules`) junto con un pequeño objeto de configuración en `window.$docsify`. En tiempo de ejecución, el script lee el hash de la URL (`#/some/page`), descarga el archivo `.md` correspondiente con `fetch()`, lo procesa con `marked` para el análisis de Markdown y con `Prism` para el resaltado de sintaxis, e inyecta el resultado en la página. La navegación se basa en el hash por defecto; el modo History API es opcional, pero requiere reescrituras en el servidor.

La organización del contenido no tiene restricciones en el lado de Livemark: escanea por glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la defina un campo `path:` del frontmatter. No hay una carpeta `docs/` obligatoria: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de los paquetes o de cualquier otro lugar. Docsify lee desde una única raíz de origen (el directorio que contiene `index.html`, configurable mediante `basePath`), y la URL solicitada se corresponde directamente con una ruta de archivo en disco: `#/guide/install` descarga `guide/install.md`. La navegación de la barra lateral se escribe a mano en `_sidebar.md`; no hay navegación autogenerada.

## Superficie de contenido {#content-surface}

Ambas herramientas aceptan Markdown. La asimetría está en lo que se puede incrustar y en cómo se renderiza.

Docsify admite Markdown simple (CommonMark mediante `marked`) con un puñado de extensiones integradas: ayudantes (avisos al estilo `> [!TIP]` mediante los plugins [`docsify-tabs`](https://jhildenbiddle.github.io/docsify-tabs/) y de admonitions), paso directo de HTML y directivas limitadas al estilo de las plantillas de Vue si se carga el compilador opcional de Vue. No hay MDX, no se analiza el frontmatter por defecto (un plugin puede añadirlo) y no hay componentes de React por página. Los plugins se registran añadiendo funciones a `window.$docsify.plugins`, donde se enganchan al ciclo de vida (`init`, `mounted`, `beforeEach`, `afterEach`, `doneEach`, `ready`).

Livemark acepta Markdown + MDX con incrustación completa de componentes de React, el frontmatter como concepto de primera clase (`path`, `order`, `icon`, `sidebar`, `date`, `tags`), compilados en tiempo de compilación por textlane.

## Matriz de funcionalidades {#feature-matrix}

| Capacidad                   | Livemark                                           | Docsify                                                         |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)         | Sí (varias instancias mediante la configuración `alias`)        |
| Internacionalización (i18n) | Sí (integrada)                                     | Sí (`fallbackLanguages` + archivos por idioma)                  |
| Búsqueda                    | Sí (Orama, en el cliente)                          | Sí (plugin de texto completo integrado)                         |
| Blog                        | Sí (tipo de sección integrado)                     | No                                                              |
| Registro de cambios         | Sí (tipo de sección)                               | No (manual)                                                     |
| Sitemap                     | Sí                                                 | No (plugin de terceros)                                         |
| RSS                         | Sí (por sección de blog)                           | No                                                              |
| Temas                       | Sobrescritura de componentes mediante `.livemark/` | Temas CSS (`vue.css`, `buble.css`, etc.)                        |
| Plugins                     | Plugins de Vite + textlane                         | Plugins JS en tiempo de ejecución sobre `window.$docsify`       |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)              | No (la URL se corresponde 1:1 con rutas de archivo)             |
| Toolchain independiente     | Node + npm                                         | Ninguna en tiempo de ejecución; `docsify-cli` solo para iniciar |

## Salida y despliegue {#output--deployment}

Aquí es donde las herramientas más divergen.

Livemark produce un directorio de HTML prerenderizado + recursos (`.livemark/build/client/`). Cada ruta es un archivo HTML real; los rastreadores, las vistas previas de enlaces y los clientes sin JS ven el contenido renderizado. El alojamiento es el habitual de cualquier sitio estático: consulta [Despliegue](/es/deployment/) para ver guías por proveedor.

Docsify distribuye los archivos `.md` en bruto junto a `index.html`. El "despliegue" consiste en subir el directorio de origen a cualquier hosting estático. La contrapartida: cero tiempo de compilación y autoría de editar y recargar, a costa de un HTML vacío en el primer pintado; los motores de búsqueda, las vistas previas sociales y los clientes sin JS solo ven el armazón del cargador. El proyecto documenta un [flujo de SSR/prerenderizado](https://docsify.js.org/#/ssr) con `docsify-ssr` o prerenderizadores externos para mitigarlo en sitios sensibles al SEO.

## Ver también {#see-also}

- [Autoría](/es/authoring/): la superficie de Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
