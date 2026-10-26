---
title: GitBook vs Livemark
label: GitBook
description: SaaS alojado con editor de bloques y Git Sync frente a documentación estática basada en archivos y autoalojada.
path: /comparison/gitbook/
icon: notebook-pen
order: 10
---

# GitBook vs Livemark

[GitBook](https://www.gitbook.com) es una plataforma comercial de documentación alojada. La autoría se hace en un editor de bloques en el navegador (al estilo de Notion), el contenido vive en la base de datos de GitBook y se publica en sitios alojados por GitBook bajo `gitbook.io` o un dominio propio. Una funcionalidad llamada Git Sync puede reflejar esa base de datos hacia y desde un repositorio de GitHub/GitLab como Markdown, pero la fuente de verdad es el propio GitBook, no el repositorio.

El antiguo generador estático de código abierto `gitbook-cli` quedó obsoleto en 2018 y no tiene relación con el producto actual; esta página cubre la plataforma alojada actual.

## De un vistazo [#at-a-glance]

| Eje                        | Livemark                                     | GitBook                                                                         |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| Lenguaje / runtime         | TypeScript / Node 24+                        | SaaS alojado (sin runtime local)                                                |
| Framework de UI            | React 19                                     | Propietario (renderizado por GitBook)                                           |
| Herramienta de compilación | Vite + TanStack Start                        | Ninguna (sin compilación por parte del usuario)                                 |
| Formato de contenido       | Markdown + MDX                               | Modelo de bloques en el editor; Markdown con sabor GitBook mediante Git         |
| Licencia                   | MIT, autoalojado                             | Propietaria; plan gratuito + planes de pago; autoalojamiento solo en Enterprise |
| Modelo de salida           | Estático prerenderizado (compatible con SSR) | Alojado en la infraestructura de GitBook                                        |

## Arquitectura [#architecture]

Livemark se apoya en Vite, TanStack Start y React. La autoría sigue las convenciones de JS/TS (`livemark.config.ts`, plugins instalables con npm, componentes MDX escritos en React) y las páginas se prerenderizan a HTML estático en tiempo de compilación.

GitBook es un SaaS multiinquilino. El contenido se escribe en un editor WYSIWYG basado en bloques: cada párrafo, encabezado, bloque de código, nota o elemento incrustado es un bloque tipado almacenado en la base de datos de GitBook. El runtime es el propio de GitBook: no hay un paso de compilación que ejecute el usuario ni un sitio estático que despliegue. El alojamiento, la indexación para la búsqueda, la CDN, las redirecciones y la analítica los gestiona la plataforma.

Git Sync es una integración opcional que vincula un espacio de GitBook a una rama de un repositorio de GitHub o GitLab. El contenido va y viene entre el editor y un directorio de archivos `.md` escritos en la variante extendida de Markdown de GitBook (notas con `{% hint %}`, pestañas, referencias de contenido, bloques OpenAPI, etc.). Es bidireccional: las ediciones en el editor envían commits al repositorio, y los commits enviados a la rama actualizan el editor. El repositorio es un espejo, no una fuente: el esquema de GitBook es el modelo canónico.

La organización del contenido no tiene restricciones en el lado de Livemark: escanea por glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo la define un campo `path:` del frontmatter en lugar de su ubicación en disco. No hay una carpeta `docs/` obligatoria. El contenido de GitBook se organiza en una jerarquía fijada por el producto (**Organizaciones → Colecciones → Espacios → Páginas**), con URLs del sitio derivadas de ese árbol. El espejo de Git Sync refleja esta jerarquía como directorios anidados.

## Superficie de contenido [#content-surface]

Livemark acepta Markdown + MDX con incrustación de componentes de React, el frontmatter como concepto de primera clase (`path`, `order`, `icon`, `sidebar`, `date`, `tags`) y plugins de remark/rehype aplicados en tiempo de compilación.

La superficie de GitBook es la paleta de bloques del editor: párrafos, encabezados, listas, tablas, notas (info/warning/danger/success), pestañas, bloques desplegables, bloques de código con grupos de pestañas, archivos, imágenes, dibujos, matemáticas (KaTeX), incrustaciones (Figma, Loom, etc.), bloques de métodos de API, referencias OpenAPI y referencias de contenido (transclusión entre espacios). Los componentes personalizados no son extensibles por el usuario: el conjunto de bloques es el que ofrece GitBook. La variante de Markdown de Git Sync codifica los bloques que no están en CommonMark mediante etiquetas al estilo Liquid, como `{% hint style="info" %}…{% endhint %}` y `{% tabs %}…{% endtabs %}`.

OpenAPI es una entrada de primera clase: GitBook puede importar una especificación OpenAPI y renderizar páginas de referencia de API a partir de ella, lo que se acerca más a la superficie de Mintlify que a la de Livemark.

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                       | Livemark                                           | GitBook                                                                                                |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Versionado                      | Parcial (secciones o despliegues por rama)         | Sí (variantes de espacio / grupos de versiones)                                                        |
| Internacionalización (i18n)     | Sí (integrada)                                     | Sí (variantes por idioma de un espacio)                                                                |
| Búsqueda                        | Sí (Orama, en el cliente)                          | Sí (alojada, con GitBook AI / preguntas y respuestas "Lens" en planes de pago)                         |
| Blog                            | Sí (tipo de sección integrado)                     | No                                                                                                     |
| Registro de cambios             | Sí (tipo de sección)                               | No (las Change Requests son un flujo editorial, no una sección publicada)                              |
| Sitemap                         | Sí                                                 | Sí (generado por la plataforma)                                                                        |
| RSS                             | Sí (por sección de blog)                           | No                                                                                                     |
| Temas                           | Sobrescritura de componentes mediante `.livemark/` | Personalización mediante los ajustes del sitio (colores, fuentes, layout); sin sobrescribir plantillas |
| Plugins                         | Plugins de Vite + remark/rehype                    | Integraciones propietarias (Intercom, Segment, GA, etc.)                                               |
| Rutas personalizadas            | `.livemark/routes/` (TanStack Router)              | No (las URLs siguen la jerarquía espacio → página)                                                     |
| Referencia de API desde OpenAPI | No (manual)                                        | Sí (integrada)                                                                                         |
| Toolchain independiente         | Node + npm                                         | Ninguna por parte del usuario; SaaS                                                                    |

## Salida y despliegue [#output--deployment]

Livemark produce un directorio de HTML prerenderizado + recursos (`.livemark/build/client/`) que puede subirse a cualquier hosting estático. Consulta [Despliegue](/es/deployment/) para ver guías por proveedor.

GitBook no genera un artefacto desplegable. El sitio se aloja en `<space>.gitbook.io` por defecto, o se asocia a un dominio propio mediante DNS. La CDN, el TLS, las redirecciones, el control de acceso y la analítica se configuran en el panel de GitBook. El autoalojamiento está restringido al plan Enterprise y no está disponible en los planes estándar. Lo más parecido a "tu contenido" es lo que el espejo de Git Sync escribe en el repositorio conectado, que es solo contenido, no un sitio compilable.

## Ver también [#see-also]

- [Autoría](/es/authoring/): la superficie de Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
