---
description: Sobrescribe cualquier componente, elemento u hoja de estilos de Livemark colocando un archivo con el mismo nombre en .livemark/.
label: Escape
icon: file-pen-line
order: 10
path: /customization/overriding-escaping/
---

# Escapar para sobrescribir componentes

Livemark incluye una biblioteca de componentes React, primitivas al estilo shadcn y una hoja de estilos base. Cada archivo se puede sobrescribir colocando un archivo con el mismo nombre en `.livemark/`:

| Para sobrescribir                                         | Coloca un archivo en              |
| --------------------------------------------------------- | --------------------------------- |
| `source/components/<Name>.tsx`                            | `.livemark/components/<Name>.tsx` |
| `source/elements/<name>.tsx`                              | `.livemark/elements/<name>.tsx`   |
| `source/styles/<name>.css`                                | `.livemark/styles/<name>.css`     |
| `source/routes/<route>.tsx`                               | `.livemark/routes/<route>.tsx`    |
| `source/client.tsx`, `server.ts`, `router.tsx`, `head.ts` | `.livemark/<mismo nombre>`        |

Las rutas `source/` están dentro de `node_modules/livemark/`. Los archivos de `.livemark/public/` se añaden a los recursos estáticos del sitio y se sirven desde su raíz.

No hace falta cambiar ningún import. El resto de Livemark detecta automáticamente el archivo sobrescrito.

## El comando `livemark escape` [#the-livemark-escape-command]

Buscar y copiar un archivo por defecto para sobrescribirlo está automatizado:

```bash
# Pick files from a searchable list:
livemark escape

# Print every overridable file:
livemark escape --list

# Copy specific defaults into .livemark/:
livemark escape components/Footer.tsx elements/button.tsx
```

En una terminal, `livemark escape` abre un selector: escribe para filtrar, <kbd>Tab</kbd> para seleccionar, <kbd>Enter</kbd> para copiar. Los archivos que ya sobrescribes se muestran, pero no se pueden elegir. Fuera de una terminal (una tubería, CI) imprime la lista, igual que `--list`.

`livemark escape` se niega a sobrescribir un archivo existente. Borra primero tu versión si quieres empezar de cero.

Borrar una sobrescritura restaura el archivo por defecto: al instante mientras se ejecuta el servidor de desarrollo, o si no, en el siguiente `start` o `build`.

## Ejemplo: pie de página personalizado [#example-custom-footer]

```bash
livemark escape components/Footer.tsx
```

Después edita `.livemark/components/Footer.tsx`:

```tsx title=".livemark/components/Footer.tsx"
export function Footer() {
  return (
    <p className="mt-12 text-center text-sm text-muted-foreground">
      Built by my team · 2026
    </p>
  )
}
```

Guarda: el servidor de desarrollo lo detecta de inmediato.

## Ejemplo: cambiar el estilo de los botones [#example-retheme-buttons]

```bash
livemark escape elements/button.tsx
```

Edita la lista de clases de `cva` en `.livemark/elements/button.tsx` para cambiar el estilo de los botones de forma global. Como todos los componentes que incluye Livemark importan su `Button` a través del sistema de sobrescritura, tu variante se aplica en todas partes.

## Ejemplo: ajustar un token [#example-tweak-a-token]

```bash
livemark escape styles/general.css
```

Edita el bloque `:root` de `.livemark/styles/general.css` para cambiar la marca:

```css
:root {
  --primary: oklch(0.55 0.24 27); /* red */
}
```

## Importar otros módulos de Livemark desde una sobrescritura [#importing-other-livemark-modules-from-an-override]

Dentro de una sobrescritura, importa otros módulos de Livemark desde los exports de subruta `livemark/<subdir>/*`:

```tsx title=".livemark/components/Footer.tsx"
import { cn } from "cn"
import { Button } from "livemark/elements/button"
```

Esas rutas se resuelven durante la compilación y pasan por la misma búsqueda de sobrescrituras: si también has sobrescrito `button`, tu versión gana ahí también.

### Comprobación de tipos de las sobrescrituras [#type-checking-overrides]

Un archivo escapado conserva los imports relativos del archivo por defecto del que se copió (`../hooks/site.ts`). Estos se resuelven dentro del montaje que Livemark genera para `start` y `build`, no junto a `.livemark/`, así que el `tsc --noEmit` de tu propio proyecto no puede comprobar un archivo escapado: deja `.livemark/` fuera de su programa. Lo que verifica una sobrescritura es `livemark build`: la empaqueta con el resto de Livemark y falla cuando un import no se resuelve.

Un archivo que escribas tú mismo y que solo importe desde los exports `livemark/<subdir>/*` sí se puede comprobar, incluido el módulo `livemark:virtual` del que sale la configuración del sitio. Sus tipos se cargan con el paquete `livemark`: cualquier programa que incluya `livemark.config.ts` ya los tiene. Un programa que no lo incluya añade una línea a un archivo `.d.ts`:

```ts title=".livemark/env.d.ts"
/// <reference types="livemark/env" />
```

No declares `livemark:virtual` por tu cuenta: una declaración escrita a mano se desvía del tipo real de la configuración.

## Lo que no puedes sobrescribir así [#what-you-cant-override-this-way]

- **Páginas nuevas**: son [rutas personalizadas](/es/customization/custom-routes/), que se añaden en la misma carpeta `.livemark/routes/`.
- **Código de servidor** (`actions/`, `commands/`): no se puede sobrescribir; haz un fork del repositorio si necesitas cambiarlo.
- **Esquema de configuración**: la forma de `livemark.config.ts` es fija.

## Ver también [#see-also]

- [Temas de sintaxis](/es/customization/syntax-themes/): el ajuste más ligero si solo quieres cambiar los colores del código.
- [Rutas personalizadas](/es/customization/custom-routes/): crear páginas nuevas (en lugar de reemplazar las existentes).
