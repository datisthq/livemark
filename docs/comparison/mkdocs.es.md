---
title: MkDocs vs Livemark
label: MkDocs
description: TypeScript + React + MDX frente a Python + Jinja2 + Markdown.
path: /comparison/mkdocs/
icon: book-marked
order: 7
---

# MkDocs vs Livemark

[MkDocs](https://www.mkdocs.org) es un generador de documentación basado en Python. El contenido es Markdown plano, las plantillas son de Jinja2 y los temas son paquetes de Python instalables con pip. El tema de facto es [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), que es lo que usa en realidad la mayoría.

## De un vistazo {#at-a-glance}

| Eje                             | Livemark                                     | MkDocs                                                 |
| ------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Lenguaje / entorno de ejecución | TypeScript / Node 24+                        | Python 3.8+                                            |
| Framework de UI                 | React 19                                     | Plantillas Jinja2 (HTML + CSS)                         |
| Herramienta de compilación      | Vite + TanStack Start                        | MkDocs CLI                                             |
| Formato de contenido            | Markdown + MDX                               | Markdown (CommonMark + extensiones de Python-Markdown) |
| Licencia                        | MIT, autoalojado                             | BSD-2-Clause, autoalojado                              |
| Modelo de salida                | Estático prerenderizado (compatible con SSR) | Estático prerenderizado                                |

## Arquitectura {#architecture}

Livemark se apoya en Vite, TanStack Start y React. La redacción sigue las convenciones de JS/TS (`livemark.config.ts`, plugins instalables con npm, componentes MDX escritos en React).

MkDocs es una CLI de Python. El sitio se configura con `mkdocs.yml`. Los temas se instalan con pip; el pipeline de compilación pasa el contenido Markdown por Python-Markdown (o pymdown-extensions) y por plantillas Jinja2. No hay paso de compilación de JavaScript: la interactividad del sitio renderizado es la que emitan las plantillas del tema.

Material for MkDocs añade un tema cuidado, un índice de búsqueda basado en lunr.js, navegación instantánea y un amplio ecosistema de plugins (los extras de `mkdocs-material`, más el espacio de nombres más amplio de plugins `mkdocs-*` en PyPI).

En Livemark la organización del contenido no tiene restricciones: escanea mediante glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la fije un campo `path:` del frontmatter. No hace falta una carpeta `docs/`: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de paquetes o cualquier otro lugar. MkDocs lee de `docs/` (configurable mediante `docs_dir` en `mkdocs.yml`), con rutas derivadas de las rutas de archivo dentro de ese directorio.

## Superficie de contenido {#content-surface}

Ambas herramientas aceptan Markdown con frontmatter. La gran asimetría está en la inserción de componentes: Livemark acepta MDX (componentes React en archivos `.mdx`); MkDocs solo acepta Markdown.

MkDocs amplía Markdown mediante extensiones de Python-Markdown (admoniciones, pestañas, notas al pie, listas de definiciones) y `pymdown-extensions` (que añade toda la sintaxis de Material: pestañas `=== "Tab 1"`, admoniciones `:::note`, atajos de teclado `++ctrl++`, etc.). Personalizar más allá de lo que ofrecen las extensiones requiere escribir un plugin de Python o sobrescribir una plantilla Jinja.

La forma del frontmatter difiere: MkDocs lee `title`, `summary`, `tags` (con un plugin), `template`, y usa `mkdocs.yml` para la navegación. Livemark usa `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Matriz de funcionalidades {#feature-matrix}

| Capacidad                     | Livemark                                      | MkDocs (Material)                          |
| ----------------------------- | --------------------------------------------- | ------------------------------------------ |
| Versionado                    | Parcial (secciones o despliegues por rama)    | Sí (con el plugin `mike`)                  |
| Internacionalización (i18n)   | Sí (integrado)                                | Sí (plugin i18n de Material)               |
| Búsqueda                      | Sí (Orama, en el cliente)                     | Sí (integrada, en el cliente)              |
| Blog                          | Sí (tipo de sección integrado)                | Sí (plugin de blog de Material)            |
| Registro de cambios           | Sí (tipo de sección)                          | No (manual)                                |
| Sitemap                       | Sí                                            | Sí                                         |
| RSS                           | Sí (por sección de blog)                      | Mediante plugin                            |
| Temas                         | Sobrescritura de componentes vía `.livemark/` | Paquetes de temas + sobrescritura de Jinja |
| Plugins                       | Plugins de Vite + textlane                    | Plugins de Python (`mkdocs-*` en PyPI)     |
| Rutas personalizadas          | `.livemark/routes/` (TanStack Router)         | No (solo contenido)                        |
| Cadena de herramientas propia | Node + npm                                    | Python + pip                               |

## Salida y despliegue {#output--deployment}

Ambas herramientas producen HTML estático + recursos listos para cualquier hosting estático. MkDocs emite en `site/` por defecto; Livemark emite en `.livemark/build/client/`. El alojamiento es igual en ambos casos; consulta [Despliegue](/es/deployment/) de Livemark para las guías por hosting.

## Ver también {#see-also}

- [Redacción](/es/authoring/): la superficie Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
