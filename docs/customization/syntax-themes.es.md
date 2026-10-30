---
title: Temas de sintaxis
description: Elige temas claro y oscuro para los bloques de código delimitados.
path: /customization/syntax-themes/
icon: palette
order: 6
---

# Temas de sintaxis

Livemark usa [Shiki](https://shiki.style) para resaltar los bloques de código delimitados. Cada tema se renderiza en dos variantes: un tema claro que se activa sobre fondos claros y un tema oscuro que se activa sobre fondos oscuros. El adecuado se elige automáticamente según la preferencia de tema del visitante.

## Configuración {#configuration}

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  include: "docs/**/*.md",
  codeThemeLight: "github-light",
  codeThemeDark: "github-dark",
})
```

| Campo            | Tipo         | Por defecto          |
| ---------------- | ------------ | -------------------- |
| `codeThemeLight` | `ShikiTheme` | `"catppuccin-latte"` |
| `codeThemeDark`  | `ShikiTheme` | `"catppuccin-mocha"` |

Funciona cualquier [nombre de tema integrado de Shiki](https://shiki.style/themes).

## Combinaciones populares {#popular-pairings}

- `github-light` / `github-dark`
- `catppuccin-latte` / `catppuccin-mocha` (por defecto)
- `min-light` / `min-dark`
- `vitesse-light` / `vitesse-dark`
- `one-light` / `one-dark-pro`

## Una nota sobre accesibilidad {#a-note-on-accessibility}

Livemark aplica de serie un pequeño ajuste de color a `catppuccin-latte`: el verde por defecto de las cadenas del tema (`#40a02b`) tiene una relación de contraste de 3,2:1 sobre su fondo, por debajo de WCAG AA (4,5:1). Livemark lo reasigna a `#2a7e16` durante la compilación.

Si usas tu propio tema y quieres cumplir AA, comprueba el color de cada token frente al fondo del bloque de código con una herramienta de contraste antes de publicar. El umbral necesario para texto de tamaño normal es 4,5:1.

## Ver también {#see-also}

- [Bloques de código](/es/authoring/code-blocks/): la parte de autoría: cadenas meta, diffs, resaltado de líneas.
- [Sobrescritura/Escape](/es/customization/overriding-escaping/): sobrescribe el componente completo de bloque de código si necesitas más control.
