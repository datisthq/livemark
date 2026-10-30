---
title: Elementos enriquecidos
path: /authoring/rich-elements/
icon: layout-grid
order: 6
---

# Elementos enriquecidos

## Tablas {#tables}

Tablas GFM estándar con columnas ordenables: haz clic en cualquier cabecera para ordenar:

```md
| Language   | Year | Typing  |
| ---------- | ---- | ------- |
| TypeScript | 2012 | Static  |
| Python     | 1991 | Dynamic |
| Rust       | 2010 | Static  |
| JavaScript | 1995 | Dynamic |
```

Se renderiza así:

| Lenguaje   | Año  | Tipado   |
| ---------- | ---- | -------- |
| TypeScript | 2012 | Estático |
| Python     | 1991 | Dinámico |
| Rust       | 2010 | Estático |
| JavaScript | 1995 | Dinámico |

## Avisos {#callouts}

Los avisos destacan información importante. Tipos disponibles: note, tip, info, warning, danger.

Sintaxis de GitHub:

```md
> [!TIP]
> GitHub syntax also works.
```

Sintaxis de directiva:

```md
:::note
This is a note.
:::
```

Título personalizado:

```md
:::warning[Breaking Change]
This API has been removed in v2.
:::
```

Se renderiza así:

:::note
Esto es una nota.
:::

:::tip
Un consejo útil.
:::

:::warning
Ten cuidado con esto.
:::

:::danger
¡Advertencia crítica!
:::

:::info
Contexto adicional.
:::

:::warning[Cambio incompatible]
Esta API se ha eliminado en la v2.
:::

## Desplegables {#expandable}

Crea contenido desplegable con la directiva `:::details`:

```md
:::details[Click to expand]
Hidden content here with **markdown** support.
:::
```

Se renderiza así:

:::details[Haz clic para desplegar]
Contenido oculto con soporte de **markdown**.
:::

Puedes anidar cualquier markdown dentro, incluidos bloques de código, listas y avisos:

:::details[Ejemplo de configuración]

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/*.md",
})
```

:::

## Pestañas de código {#code-tabs}

Agrupa bloques de código consecutivos en pestañas con la meta `tab="name"`:

````md
```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```
````

Se renderiza así:

```js tab="JavaScript"
console.log("hello")
```

```python tab="Python"
print("hello")
```

Añade `sync="key"` para mantener sincronizados varios grupos de pestañas de código en la página. Al seleccionar una pestaña en un grupo se actualizan todos los demás con la misma clave:

````md
```js tab="JavaScript" sync="lang"
console.log("hello")
```

```python tab="Python" sync="lang"
print("hello")
```
````

## Pestañas de contenido {#content-tabs}

Agrupa contenido arbitrario en pestañas con la directiva `:::tab`. Las pestañas consecutivas se agrupan automáticamente.

Añade un atributo `sync` para sincronizar la selección de pestañas entre varios grupos de la misma página. Cuando un usuario selecciona una pestaña en un grupo, todos los demás grupos con la misma clave `sync` cambian a la pestaña correspondiente. La selección se guarda en localStorage.

```md
:::tab{title="npm" sync="pm"}
npm install livemark
:::

:::tab{title="pnpm" sync="pm"}
pnpm add livemark
:::
```

Este es un ejemplo sin sync:

```md
:::tab{title="React"}
React uses JSX for templating and hooks for state management.
:::

:::tab{title="Vue"}
Vue uses single-file components with template, script, and style sections.
:::
```

Se renderiza así:

:::tab{title="React"}
React usa **JSX** para las plantillas y hooks para la gestión del estado.

```jsx
function App() {
  return <h1>Hello</h1>
}
```

:::

:::tab{title="Vue"}
Vue usa **componentes de un solo archivo** con secciones de plantilla, script y estilo.

```vue
<template>
  <h1>Hello</h1>
</template>
```

:::

## Pasos {#steps}

Añade `[step]` a los encabezados para crear guías numeradas paso a paso:

```md
### Install Dependencies [step]

Run `npm install` to add all required packages.

### Configure Project [step]

Create a config file in the project root.

### Deploy [step]

Push to production.
```

Se renderiza así:

### Instalar dependencias {#install-dependencies} [step]

Ejecuta `npm install` para añadir todos los paquetes necesarios.

### Configurar el proyecto {#configure-project} [step]

Crea un archivo de configuración en la raíz del proyecto.

### Desplegar {#deploy} [step]

Publica en producción.

## Tarjetas {#cards}

Crea tarjetas de contenido con la directiva `:::card`. Las tarjetas consecutivas se agrupan automáticamente en una cuadrícula.

```md
:::card{title="Getting Started" href="/introduction" icon="rocket"}
Learn how to set up your first project.
:::
```

```md
:::card{title="Configuration" href="/configuration" icon="layers"}
Configure your Livemark project.
:::
```

Se renderiza así:

:::card{title="Primeros pasos" href="/es/introduction/" icon="rocket"}
Aprende a configurar tu primer proyecto.
:::

:::card{title="Configuración" href="/es/customization/config-file/" icon="layers"}
Configura tu proyecto de Livemark.
:::

:::card{title="GitHub" href="https://github.com/datisthq/livemark" icon="github"}
Consulta el código fuente en GitHub.
:::

:::card{title="Markdown" icon="file-code"}
Esta página documenta todas las funcionalidades de markdown.
:::

## Insignias {#badges}

Insignias de estado en línea con la directiva `:badge`:

```md
:badge[Beta] :badge[Stable]{variant="positive"} :badge[Experimental]{variant="warning"} :badge[Deprecated]{variant="destructive"} :badge[New]{variant="secondary"}
```

Se renderiza así:

:badge[Beta] :badge[Estable]{variant="positive"} :badge[Experimental]{variant="warning"} :badge[Obsoleto]{variant="destructive"} :badge[Nuevo]{variant="secondary"}

Variantes disponibles: `default`, `secondary`, `positive`, `warning`, `destructive`, `outline`, `ghost`, `link`.

## Botones {#buttons}

Botones de enlace para llamadas a la acción con la directiva hoja `::button`:

```md
::button[Get Started]{href="/introduction"}
```

Con opciones de variante y tamaño:

```md
::button[Get Started]{href="/introduction" variant="default" size="lg"}
::button[Configuration]{href="/configuration" variant="outline"}
::button[View Source]{href="/github" variant="secondary" size="sm"}
```

También puedes usar el atributo `label`:

```md
::button{href="/introduction" label="Get Started"}
```

Se renderiza así:

::button[Empezar]{href="/es/introduction/" variant="default" size="lg"}
::button[Configuración]{href="/es/customization/config-file/" variant="outline"}
::button[Ver código fuente]{href="https://github.com/datisthq/livemark" variant="secondary" size="sm"}

Variantes disponibles: `default`, `outline`, `secondary`, `ghost`, `positive`, `warning`, `destructive`, `link`. Tamaños disponibles: `default`, `sm`, `lg`.

## Iconos {#icons}

Iconos en línea de la biblioteca Lucide con la directiva `:icon`:

```md
:icon{name="rocket"} Launch :icon{name="check"} Done :icon{name="heart"} Love
```

Se renderiza así:

:icon{name="rocket"} Lanzar :icon{name="check"} Hecho :icon{name="heart"} Amor

Con colores de Tailwind:

```md
:icon{name="check" className="text-positive"} Pass :icon{name="x" className="text-destructive"} Fail :icon{name="star" className="text-warning"} Star
```

Se renderiza así:

:icon{name="check" className="text-positive"} Correcto :icon{name="x" className="text-destructive"} Fallo :icon{name="star" className="text-warning"} Estrella

## Árbol de archivos {#file-tree}

Muestra estructuras de archivos y directorios con la directiva `:::filetree`. Los directorios se indican con una `/` final:

```md
:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json
:::
```

Se renderiza así:

:::filetree

- src/
  - components/
    - Button.tsx
    - Card.tsx
  - helpers/
    - style.ts
  - index.ts
- package.json
- tsconfig.json

:::

## Columnas {#columns}

Coloca contenido lado a lado con directivas `:::column` consecutivas. Se agrupan automáticamente en una cuadrícula:

```md
:::column
**Left column** with markdown content.
:::

:::column
**Right column** with more content.
:::
```

Se renderiza así:

:::column
**Columna izquierda** con contenido markdown, incluidas listas:

- Elemento uno
- Elemento dos

:::

:::column
**Columna derecha** con más contenido:

> Aquí también funciona una cita.

:::
