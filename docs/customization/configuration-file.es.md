---
description: Dónde vive la configuración de Livemark, qué controla y un recorrido por las opciones de nivel superior.
path: /customization/config-file/
icon: layers
order: 1
---

# Archivo de configuración

:::tip
El archivo de configuración es opcional. Por defecto, Livemark recoge todos los archivos `.md` de la carpeta donde lo ejecutas.
:::

Livemark se configura con un único archivo en la raíz de tu proyecto: **`livemark.config.ts`**. Colócalo junto a tu `package.json`, exporta una llamada `defineConfig({...})` y Livemark lo detecta automáticamente, sin flags ni variables de entorno.

## Configuración mínima [#minimal-config]

Todos los campos son opcionales. La configuración válida más pequeña es una llamada vacía:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({})
```

Eso recoge todos los archivos `.md` de tu proyecto (por defecto `include: "**/*.md"`) y los renderiza con el tema estándar de Livemark: barra lateral, búsqueda, resaltado de sintaxis, modo oscuro, todo con valores por defecto.

## Qué puedes configurar [#what-you-can-configure]

Cada campo tiene un valor por defecto razonable. El conjunto completo:

| Opción           | Tipo                                               | Propósito                                                                                               |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `include`        | `string \| string[]`                               | Glob(s) para los archivos de contenido. Por defecto: `"**/*.md"`.                                       |
| `exclude`        | `string \| string[]`                               | Glob(s) que se omiten (borradores, parciales, etc.).                                                    |
| `title`          | `string`                                           | Título del sitio que aparece en la cabecera y en `<title>`. Por defecto: `"Livemark"`.                  |
| `description`    | `string`                                           | Meta descripción para SEO/Open Graph. Por defecto: `"Markdown site generator"`.                         |
| `site`           | `string`                                           | URL canónica del sitio; necesaria para generar el sitemap.                                              |
| `favicon`        | `string`                                           | Ruta a una imagen de favicon, relativa a la raíz del proyecto.                                          |
| `logo`           | `string`                                           | Ruta a una imagen de logo usada en la cabecera (si falta, se usa el favicon).                           |
| `banner`         | `string`                                           | Anuncio en Markdown en línea mostrado en una franja sobre la cabecera.                                  |
| `codeThemeLight` | Nombre de tema de Shiki                            | Tema de sintaxis del modo claro. Por defecto: `"catppuccin-latte"`.                                     |
| `codeThemeDark`  | Nombre de tema de Shiki                            | Tema de sintaxis del modo oscuro. Por defecto: `"catppuccin-mocha"`.                                    |
| `sections`       | [`Section[]`](/es/customization/article-sections/) | Divide el contenido en Docs / Blog / registro de cambios, cada uno con su prefijo de URL.               |
| `links`          | [`Link[]`](/es/customization/external-links/)      | Enlaces personalizados mostrados en la cabecera o en la barra lateral.                                  |
| `patches`        | [`Patch[]`](/es/customization/article-patches/)    | Sobrescribe el frontmatter de un archivo Markdown desde la configuración sin editarlo.                  |
| `contentSignals` | [`ContentSignals`](/es/customization/ai-agents/)   | Preferencias de uso por IA publicadas en `robots.txt`. Por defecto: todas `true`.                       |
| `skills`         | `string \| string[]`                               | Glob(s) para archivos `SKILL.md` que se publican como [skills de agente](/es/customization/ai-agents/). |

El esquema completo está en [`source/models/config.ts`](https://github.com/datisthq/livemark/blob/main/source/models/config.ts): `defineConfig` lo valida con Zod, así que las erratas producen un error claro al arrancar.

## Ejemplo completo [#worked-example]

La mayoría de los sitios reales acaban pareciéndose a esto:

```ts title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: "My docs",
  description: "Documentation for my project",
  site: "https://docs.example.com",
  include: ["docs/**/*.md", "blog/**/*.md"],
  exclude: "docs/**/_*",
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
  ],
  links: [
    {
      url: "https://github.com/example/project",
      title: "GitHub",
      icon: "github",
    },
  ],
})
```

## Siguientes pasos [#where-to-go-next]

- [Metadatos del sitio](/es/customization/site-metadata/): título, descripción, favicon, logo.
- [Secciones de artículos](/es/customization/article-sections/): divide el contenido en varios prefijos de URL (docs / blog / registro de cambios).
- [Enlaces externos](/es/customization/external-links/): enlaces en la cabecera y en la barra lateral.
- [Temas de sintaxis](/es/customization/syntax-themes/): elige o amplía temas de Shiki.
- [Parches de artículos](/es/customization/article-patches/): sobrescribe el frontmatter desde la configuración.
- [Sobrescritura/Escape](/es/customization/overriding-escaping/): reemplaza cualquier componente u hoja de estilos integrada.
- [Rutas personalizadas](/es/customization/custom-routes/): añade páginas totalmente personalizadas.
