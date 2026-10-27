---
title: Mintlify vs Livemark
label: Mintlify
description: Documentación autoalojada y de código abierto frente a un SaaS comercial de documentación alojada.
path: /comparison/mintlify/
icon: sparkles
order: 3
---

# Mintlify vs Livemark

[Mintlify](https://mintlify.com) es una plataforma comercial de documentación. El contenido se escribe en MDX dentro de un repositorio Git; Mintlify aloja el sitio renderizado, la búsqueda y las analíticas. El precio es por editor, con un plan gratuito para proyectos de código abierto.

## De un vistazo [#at-a-glance]

| Eje                             | Livemark                                     | Mintlify                                                                                     |
| ------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Lenguaje / entorno de ejecución | TypeScript / Node 24+                        | Se escribe en MDX; el entorno de ejecución es la plataforma alojada de Mintlify (no pública) |
| Framework de UI                 | React 19                                     | React (según la documentación de Mintlify)                                                   |
| Herramienta de compilación      | Vite + TanStack Start                        | Mintlify CLI (vista previa) + compilación alojada                                            |
| Formato de contenido            | Markdown + MDX                               | Markdown + MDX                                                                               |
| Licencia                        | MIT, autoalojado                             | Propietaria, solo alojado                                                                    |
| Modelo de salida                | Estático prerenderizado (compatible con SSR) | Alojado en la infraestructura de Mintlify                                                    |

## Arquitectura [#architecture]

Livemark es una CLI de Node que compila un sitio estático que puedes alojar donde quieras. Tanto el código fuente como la salida son tuyos.

Mintlify es un SaaS alojado. Haces commit de MDX + una configuración `mint.json` en un repositorio Git; Mintlify lo descarga en cada push, lo compila y sirve el resultado desde `<your-subdomain>.mintlify.app` o un dominio propio. El pipeline de compilación y el entorno de ejecución están gestionados y no se pueden instalar.

En Livemark la organización del contenido no tiene restricciones: escanea mediante glob (`include`/`exclude` en `livemark.config.ts`), y la URL de cada artículo sigue la ubicación del archivo bajo su glob de `include`, salvo que la fije un campo `path:` del frontmatter. No hace falta una carpeta `docs/`: un proyecto puede tomar artículos de `README.md`, `docs/`, `blog/`, los README de paquetes o cualquier otro lugar. Mintlify espera que el árbol de archivos coincida con el bloque `navigation` de `mint.json`; las rutas reflejan las rutas de archivo bajo la raíz de contenido configurada.

## Superficie de contenido [#content-surface]

Ambas herramientas aceptan Markdown + MDX con frontmatter e inserción de componentes.

Mintlify incluye un conjunto fijo de componentes (`<Card>`, `<Accordion>`, `<Tabs>`, `<Steps>`, …) que los autores combinan en MDX. No escribes tus propios componentes React para la UI de la documentación: usas las primitivas de Mintlify.

Las directivas de Livemark (`:::card`, `:::tab`, `:::steps`) producen el mismo tipo de UI a través de la capa de componentes de Livemark, que puedes sobrescribir mediante `.livemark/components/`.

El `mint.json` de Mintlify configura la navegación, la marca y las integraciones en un único archivo declarativo. Livemark usa `livemark.config.ts` para ese mismo papel, más superposiciones en `.livemark/` para personalizar archivo a archivo.

## Matriz de funcionalidades [#feature-matrix]

| Capacidad                   | Livemark                                      | Mintlify                                     |
| --------------------------- | --------------------------------------------- | -------------------------------------------- |
| Versionado                  | Parcial (secciones o despliegues por rama)    | Sí (integrado)                               |
| Internacionalización (i18n) | Sí (integrado)                                | Sí (integrado)                               |
| Búsqueda                    | Sí (Orama, en el cliente)                     | Sí (integrada, con IA)                       |
| Chat de IA / agentes        | No                                            | Sí (integrado)                               |
| Analíticas                  | No (trae las tuyas)                           | Sí (panel integrado)                         |
| Renderizado de OpenAPI      | No                                            | Sí (integrado)                               |
| Blog                        | Sí (tipo de sección integrado)                | Sí (páginas de registro de cambios/noticias) |
| Sitemap                     | Sí                                            | Sí                                           |
| RSS                         | Sí (por sección de blog)                      | Sí (feeds del registro de cambios)           |
| Temas                       | Sobrescritura de componentes vía `.livemark/` | Temas vía `mint.json`                        |
| Rutas personalizadas        | `.livemark/routes/`                           | No (solo contenido)                          |
| Autoalojamiento             | Sí                                            | No                                           |

## Salida y despliegue [#output--deployment]

Livemark compila un directorio estático que despliegas en cualquier hosting; consulta [Despliegue](/es/deployment/).

Los despliegues de Mintlify los gestiona Mintlify. No compilas ni alojas la salida tú mismo; la plataforma sirve el sitio renderizado desde su CDN y se encarga de TLS, dominios y vistas previas. Desvincularte de Mintlify implica reescribir o migrar el contenido a otro lugar.

## Ver también [#see-also]

- [Redacción](/es/authoring/): la superficie Markdown de Livemark.
- [Personalización](/es/customization/): las opciones de configuración de Livemark y la sobrescritura de componentes.
- [Comparativa](/es/comparison/): volver al índice.
