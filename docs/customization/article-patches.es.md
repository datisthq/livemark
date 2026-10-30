---
description: Sobrescribe el frontmatter de un artículo desde tu configuración, sin tocar el archivo.
path: /customization/article-patches/
icon: pencil-ruler
order: 4
---

# Parches de artículos

A veces un archivo Markdown sirve a la vez como contenido del sitio y como archivo que se lee en otro lugar: un `README.md` que renderiza GitHub, una especificación compartida en otro proyecto. Añadirle frontmatter exclusivo de Livemark ensucia la otra vista.

`patches` te permite inyectar campos de frontmatter para un archivo concreto desde `livemark.config.ts` en lugar de editar el archivo en disco.

## Uso básico {#basic-usage}

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: ["README.md", "docs/**/*.md"],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Overview",
        icon: "sparkles",
        order: 0,
      },
    },
  ],
})
```

El archivo en disco queda limpio, pero Livemark lo renderiza como si el YAML anterior estuviera al principio.

## Campos {#fields}

| Campo     | Tipo               | Propósito                                                          |
| --------- | ------------------ | ------------------------------------------------------------------ |
| `file`    | `string`           | Ruta relativa a la colección, p. ej. `"README.md"`, `"docs/a.md"`. |
| `article` | `Partial<Article>` | Cualquier campo de frontmatter excepto `content`.                  |

Un campo del artículo como `format` funciona igual. Para fijar un archivo como Markdown simple sea cual sea su extensión:

```typescript
{ file: "CHANGELOG.md", article: { format: "md" } }
```

La coincidencia es una comparación exacta de cadenas con la ruta de archivo que recoge Livemark. Si la ruta no coincide con ningún artículo, el parche no hace nada en silencio, algo útil cuando parcheas de forma defensiva un archivo que puede existir o no.

## Semántica de fusión {#merge-semantics}

Los campos `article` de un parche se fusionan sobre el frontmatter propio del archivo. Todo lo que no especifiques en el parche conserva su valor normal (el del archivo o el de los valores automáticos de Livemark).

Así, un README sin frontmatter más:

```typescript
{ file: "README.md", article: { title: "Overview" } }
```

se renderiza como un artículo titulado "Overview". Todos los demás campos (descripción, icono, ruta, etc.) recurren a sus valores por defecto.

## Lo que no puedes parchear {#what-you-cant-patch}

La clave `content` se rechaza al cargar la configuración:

```typescript
// Throws at startup:
{ file: "README.md", article: { content: "replaced" } }
```

Los parches son para metadatos; el contenido del archivo es siempre el contenido del archivo.

## Ver también {#see-also}

- [Frontmatter](/es/authoring/frontmatter/): todos los campos que puedes definir, ya sea en el archivo o mediante un parche.
- [Configuración](/es/customization/config-file/): el glob `include` que decide qué archivos puede alcanzar un parche.
