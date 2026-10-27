---
title: Bloques de código
path: /authoring/code-blocks/
icon: code
order: 7
---

# Bloques de código

Los bloques de código delimitados se resaltan con Shiki usando los temas catppuccin. Cada bloque de código incluye un botón que alterna entre desplazamiento horizontal y líneas ajustadas. Un bloque sin lenguaje, o con uno que Shiki no conoce, se renderiza como texto plano con el mismo estilo.

## Títulos [#titles]

Añade un nombre de archivo o un título a los bloques de código:

````md
```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"
```
````

Se renderiza así:

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/*.md",
})
```

## Resaltado de líneas [#line-highlighting]

Resalta líneas concretas con la sintaxis `{line,range}` en la cadena meta o con comentarios `// [!code highlight]` dentro del bloque de código.

Con la sintaxis meta:

````md
```typescript {2,4-6}
const a = 1
const b = 2
```
````

Se renderiza así:

```typescript {2,4-6}
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

Con la sintaxis de comentario (`// [!code highlight]`):

````md
```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```
````

Se renderiza así:

```typescript
const greeting = "hello"
const target = "world" // [!code highlight]
```

Las anotaciones en comentarios se eliminan de la salida renderizada. También se admite la sintaxis de comentario de bloque `/* [!code highlight] */`.

## Resaltado de palabras [#word-highlighting]

Resalta todas las apariciones de una palabra con la sintaxis `{word:TERM}`:

````md
```typescript {word:config}
const config = loadConfig()
export default config
```
````

Se renderiza así:

```typescript {word:config}
const config = loadConfig()
export default config
```

## Números de línea [#line-numbers]

Muestra números de línea junto al código con `lineNumbers`:

````md
```typescript lineNumbers
const a = 1
const b = 2
```
````

Se renderiza así:

```typescript lineNumbers
const a = 1
const b = 2
const c = 3
```

Empieza a numerar desde una línea concreta con `lineNumbers=N`:

````md
```typescript lineNumbers=5
const a = 1
const b = 2
```
````

Se renderiza así:

```typescript lineNumbers=5
const a = 1
const b = 2
const c = 3
```

## Líneas de diff [#diff-lines]

Marca líneas como añadidas o eliminadas con `// [!code ++]` y `// [!code --]`:

````md
```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```
````

Se renderiza así:

```typescript
const old = "removed" // [!code --]
const next = "added" // [!code ++]
```

## Líneas enfocadas [#focus-lines]

Atenúa todas las líneas excepto las enfocadas con `// [!code focus]`:

````md
```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```
````

Se renderiza así:

```typescript
const a = 1
const b = 2 // [!code focus]
const c = 3
```

## Errores y advertencias [#error-and-warning]

Marca líneas como errores o advertencias con `// [!code error]` y `// [!code warning]`:

````md
```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```
````

Se renderiza así:

```typescript
const valid = "ok"
const invalid = null! // [!code error]
const risky = getValue() // [!code warning]
```

## Código plegable [#collapsible-code]

Limita la altura visible de los bloques de código largos con `maxLines=N`. Un botón "Expand" muestra el código completo:

````md
```typescript maxLines=3
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```
````

Se renderiza así:

```typescript maxLines=3
const a = 1
const b = 2
const c = 3
const d = 4
const e = 5
const f = 6
```

## Iconos de lenguaje [#language-icons]

Los bloques de código muestran automáticamente un icono del lenguaje en la barra de título cuando hay un título. Los lenguajes admitidos incluyen TypeScript, JavaScript, React, Python, Rust y shell.

```typescript title="example.ts"
const greeting = "hello"
```

```python title="example.py"
greeting = "hello"
```

```rust title="example.rs"
let greeting = "hello";
```

## Soporte de TypeScript [#typescript-support]

Añade `twoslash` a un bloque de código TypeScript para activar la información de tipos en línea. Pasa el cursor sobre los identificadores resaltados para ver sus tipos:

````md
```typescript twoslash
const greeting = "hello"
//    ^?
```
````

Se renderiza así:

```typescript twoslash
const greeting = "hello"
//    ^?
```

Usa `// @errors: 2304` para mostrar errores esperados:

```typescript twoslash
// @errors: 2304
const x = unknown_var
```

## Comandos de npm [#npm-commands]

Escribe comandos de npm y obtén automáticamente pestañas para todos los gestores de paquetes:

````md
```npm
npm install livemark
```
````

Se renderiza así:

```npm
npm install livemark
```
