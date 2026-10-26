---
title: Hugo vs Livemark
label: Hugo
description: Herramienta de Node centrada en documentación frente a generador de sitios estáticos de propósito general en Go.
path: /comparison/hugo/
icon: feather
order: 8
---

# Hugo vs Livemark

[Hugo](https://gohugo.io) es un generador de sitios estáticos de propósito general escrito en Go. Se distribuye como un único binario, compila extremadamente rápido y da vida a todo tipo de sitios, desde blogs y portfolios hasta sitios de documentación mediante temas de la comunidad como [Docsy](https://www.docsy.dev) y [Hugo Book](https://github.com/alex-shpak/hugo-book).

## De un vistazo [#at-a-glance]

| Eje                        | Livemark                                     | Hugo                               |
| -------------------------- | -------------------------------------------- | ---------------------------------- |
| Lenguaje / runtime         | TypeScript / Node 24+                        | Go (un único binario, sin runtime) |
| Framework de UI            | React 19                                     | Plantillas de Go (HTML + CSS)      |
| Herramienta de compilación | Vite + TanStack Start                        | Binario de Hugo                    |
| Formato de contenido       | Markdown + MDX                               | Markdown con shortcodes de Hugo    |
| Licencia                   | MIT, autoalojado                             | Apache-2.0, autoalojado            |
| Modelo de salida           | Estático prerenderizado (compatible con SSR) | Estático prerenderizado            |

## Arquitectura [#architecture]

Livemark es una CLI de Node construida sobre Vite + TanStack Start + React. La autoría sigue las convenciones de JS/TS.

Hugo es un único binario de Go: sin dependencias de runtime ni paso de instalación de paquetes. La estructura del sitio se basa en convenciones: `content/`, `layouts/`, `static/`, `themes/`, `config.toml` (o `.yaml`/`.json`). Los layouts usan la sintaxis de `html/template` de Go. Los temas se añaden como submódulos de git o se copian en `themes/<name>/`.

Hugo no es específico para documentación. El mismo binario da vida a blogs, sitios de marketing, portfolios y documentación; el caso de uso de documentación se cubre mediante temas en lugar de tipos de sección de primera clase.

La organización del contenido no tiene restricciones en el lado de Livemark: escanea por glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo la define un campo `path:` del frontmatter en lugar de su ubicación en disco. No hay una carpeta `docs/` obligatoria: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de los paquetes o de cualquier otro lugar. Hugo lee desde `content/` con una estructura de URLs que refleja el árbol de directorios (y sobrescrituras del frontmatter por sección).

## Superficie de contenido [#content-surface]

Ambas herramientas aceptan Markdown con frontmatter.

La gran asimetría es la incrustación de componentes: Livemark usa MDX (componentes de React en `.md`/`.mdx`). Hugo usa **shortcodes**: funciones con plantillas de Go invocadas desde Markdown con `{{< shortcode-name arg="value" >}}`. Los shortcodes se definen en `layouts/shortcodes/*.html` como fragmentos de plantilla de Go y emiten HTML directamente.

Hugo admite extensiones de Markdown basadas en Goldmark (notas al pie, tablas, listas de definiciones, matemáticas mediante plugins). Para una interactividad más rica, el patrón habitual es incrustar un `<script>` o usar un framework de JS como isla dentro de un shortcode.

La forma del frontmatter difiere: Hugo acepta frontmatter en TOML, YAML o JSON con campos como `title`, `date`, `draft`, `weight`, `taxonomies`, además de campos definidos por el usuario. Livemark usa YAML en línea con `path`, `order`, `icon`, `sidebar`, `date`, `tags`.

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                   | Livemark                                           | Hugo                                                |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)         | No (manual mediante ramas/sitios)                   |
| Internacionalización (i18n) | Sí (integrada)                                     | Sí (integrada, modo multilingüe)                    |
| Búsqueda                    | Sí (Orama, en el cliente)                          | No (proporcionada por el tema o externa)            |
| Blog                        | Sí (tipo de sección integrado)                     | Sí (cualquier sección puede ordenarse por fecha)    |
| Registro de cambios         | Sí (tipo de sección)                               | No (manual)                                         |
| Sitemap                     | Sí                                                 | Sí (integrado)                                      |
| RSS                         | Sí (por sección de blog)                           | Sí (integrado, por sección)                         |
| Temas                       | Sobrescritura de componentes mediante `.livemark/` | Directorios de tema con sobrescritura de plantillas |
| Plugins                     | Plugins de Vite + remark/rehype                    | Hugo Modules (Go), shortcodes, hooks                |
| Rutas personalizadas        | `.livemark/routes/` (TanStack Router)              | Layouts + secciones de contenido                    |
| Toolchain independiente     | Node + npm                                         | Un único binario de Go                              |
| Velocidad de compilación    | Rápida como Vite                                   | Entre los SSG más rápidos                           |

## Salida y despliegue [#output--deployment]

Ambas herramientas producen HTML estático + recursos listos para cualquier hosting estático. Hugo emite en `public/` por defecto; Livemark emite en `.livemark/build/client/`. El alojamiento es el mismo: consulta [Despliegue](/es/deployment/) de Livemark para ver guías por proveedor.

## Ver también [#see-also]

- [Autoría](/es/authoring/): la superficie de Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
