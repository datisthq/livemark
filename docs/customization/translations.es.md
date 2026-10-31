---
description: Publica tu documentación en varios idiomas con una sola configuración.
path: /customization/translations/
icon: languages
order: 8
---

# Traducciones

El array `languages` convierte un proyecto en un sitio multilingüe. El primer idioma es el predeterminado y conserva sus URL; cualquier otro idioma se sirve bajo su código, así que `/guide/` en español vive en `/es/guide/`.

## Uso básico {#basic-usage}

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  title: { en: "Acme Docs", es: "Documentación de Acme" },
  languages: [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ],
})
```

Después coloca cada traducción junto a su original, con el código de idioma antes de la extensión:

:::filetree

- docs/
  - guide.md
  - guide.es.md
  - guide/
    - install.md

:::

`guide.es.md` mantiene el mismo `path` de frontmatter que `guide.md` —`/guide/`— y Livemark lo sirve en `/es/guide/`. Los dos archivos se emparejan por esa ruta, así que el selector de idioma de la cabecera salta entre ellos.

## Idiomas {#languages}

| Campo      | Tipo                | Por defecto         | Propósito                                                         |
| ---------- | ------------------- | ------------------- | ----------------------------------------------------------------- |
| `code`     | `string`            | —                   | Segmento de URL y sufijo de archivo, en minúsculas (p. ej. `es`). |
| `label`    | `string`            | —                   | Nombre mostrado en el selector de idioma.                         |
| `locale`   | `string`            | `code`              | Etiqueta BCP 47 para `<html lang>`, `hreflang` y las fechas.      |
| `dir`      | `"ltr" \| "rtl"`    | según el locale     | Dirección del texto; árabe, hebreo, persa, urdu y otros son rtl.  |
| `flag`     | `string`            | según el locale     | Código de país de dos letras de la bandera del selector (`br`).   |
| `messages` | `Partial<Messages>` | traducción incluida | Sobrescrituras de cadenas individuales de la interfaz.            |

El selector de la cabecera muestra la bandera de cada idioma. Por defecto se toma de la región del locale (`pt-BR` → Brasil) o, si no la tiene, del país más ligado al idioma (`en` → Reino Unido); usa `flag` para elegir otra. Solo se incluyen las banderas de los idiomas declarados; un código sin bandera en [country-flag-icons](https://gitlab.com/catamphetamine/country-flag-icons) no muestra ninguna.

Sin `languages`, un sitio se comporta exactamente como antes: un único idioma, inglés, en `/`.

## Marcar el idioma de un artículo {#marking-an-articles-language}

El idioma de un archivo se determina, por orden, a partir de:

1. el frontmatter `language: es`, útil cuando el nombre del archivo debe quedar libre, como `blog/hola.md`;
2. un sufijo `.<code>.md` que nombre un idioma configurado: `guide.es.md`;
3. si no, el idioma predeterminado.

Un sufijo que no nombra ningún idioma configurado forma parte del nombre del archivo, así que `vite.config.md` sigue siendo un artículo en inglés.

## Traducir textos de la configuración {#translating-config-texts}

`title`, `description` y `banner`, el `title` de una sección, `siteTitle` y `siteDescription`, y el `title` de un enlace aceptan una cadena o un valor por código de idioma. Un idioma que falte recurre al valor del idioma predeterminado.

```typescript
sections: [
  { title: { en: "Guide", es: "Guía" }, prefix: "/" },
  { title: "Blog", prefix: "/blog/", type: "blog" },
]
```

Las secciones de artículos y de blog se replican para cada idioma: el sitio en español obtiene `/es/` y `/es/blog/`, cada una con su propia barra lateral, etiquetas y feed RSS. Las secciones de registro de cambios también se replican, en `/es/changelog/`: la página que rodea cada versión está en español, mientras que las notas de la versión se mantienen tal como están en el archivo del registro y señalan la página en inglés como canónica, por lo que no aparecen en el sitemap. El prefijo de una sección no puede empezar por el código de un idioma: `/es/` del ejemplo está reservado para el español.

## Páginas sin traducir {#untranslated-pages}

La barra lateral de un idioma sigue listando los artículos del idioma predeterminado que no tienen traducción, marcados con el código del idioma predeterminado y enlazados a la página original. No se duplica nada bajo el prefijo del idioma, así que los buscadores ven cada página una sola vez.

## Cadenas de la interfaz {#ui-strings}

Las etiquetas propias de Livemark —"On this page", "Search docs...", "Edit on GitHub" y el resto— vienen en inglés, alemán, español, francés, japonés, ruso y chino, y se eligen según el `locale` del idioma. Puedes sobrescribir cualquiera de ellas por idioma:

```typescript
languages: [
  { code: "en", label: "English" },
  {
    code: "es",
    label: "Español",
    messages: { "toc.title": "En esta página", "search.placeholder": "Buscar…" },
  },
]
```

Una clave desconocida hace fallar la comprobación de la configuración, así que una errata no puede dejar en silencio el texto en inglés. Para un idioma que Livemark no incluye, define en `messages` todas las cadenas que quieras traducir. La lista completa de claves es el esquema `Messages` en `source/models/message.ts`.

Un componente que sobrescribas en `.livemark/` lee las mismas cadenas con el hook `useMessages`:

```tsx
import { useMessages } from "livemark/hooks/site"

export function Footer() {
  const t = useMessages()
  return <p>{t("page.updated", { date: "Mar 7, 2025" })}</p>
}
```

## Qué recibe cada idioma {#what-each-language-gets}

- `<html lang>` y `dir` según el idioma, y fechas con el formato de su locale
- enlaces `hreflang` entre traducciones, un enlace `x-default` al idioma predeterminado y `og:locale`
- búsqueda limitada al idioma actual
- su propio `llms.txt` y sus gemelos en Markdown bajo su prefijo
- sus propios feeds RSS del blog, y su página de inicio prerenderizada e incluida en el sitemap
