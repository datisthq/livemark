---
title: Formato de texto
path: /authoring/text-formatting/
icon: type
order: 5
---

# Formato de texto

## Negrita y cursiva [#bold-and-italic]

```md
**bold text** and _italic text_ and **_bold italic_**
```

Se renderiza así: **texto en negrita** y _texto en cursiva_ y **_negrita cursiva_**

## Tachado [#strikethrough]

```md
~~deleted text~~
```

Se renderiza así: ~~texto eliminado~~

## Código en línea [#inline-code]

```md
Use `const x = 1` for inline code.
```

Se renderiza así: Usa `const x = 1` para código en línea.

## Resaltado de código en línea [#inline-code-highlighting]

Añade resaltado de sintaxis específico del lenguaje al código en línea con un prefijo `{:lang}`:

```md
Use `{:ts}const x = 1` for inline TypeScript or `{:py}print("hello")` for Python.
```

Se renderiza así:

Usa `{:ts}const x = 1` para TypeScript en línea o `{:py}print("hello")` para Python.

## Citas [#blockquotes]

```md
> This is a blockquote.
```

Se renderiza así:

> Esto es una cita.

## Listas [#lists]

Listas no ordenadas y ordenadas:

- Primer elemento
- Segundo elemento
  - Elemento anidado

1. Paso uno
2. Paso dos
3. Paso tres

## Listas de tareas [#task-lists]

```md
- [x] Completed task
- [ ] Pending task
```

Se renderiza así:

- [x] Tarea completada
- [ ] Tarea pendiente

## Líneas horizontales [#horizontal-rules]

```md
***
```

---

## Notas al pie [#footnotes]

Añade notas al pie con referencias y definiciones `[^id]`:

```md
Here is a sentence with a footnote[^1] and another[^note].

[^1]: This is a numbered footnote.

[^note]: Footnotes can use descriptive identifiers too.
```

Se renderiza así:

Esta es una frase con una nota al pie[^1] y otra[^note].

[^1]: Esta es una nota al pie numerada.

[^note]: Las notas al pie también pueden usar identificadores descriptivos.

## Listas de definiciones [#definition-lists]

Define términos con sus descripciones:

```md
Remark
: A markdown processor powered by plugins

Rehype
: An HTML processor powered by plugins

Unified
: An interface for processing content with syntax trees
: The foundation for both remark and rehype
```

Se renderiza así:

Remark
: Un procesador de markdown basado en plugins

Rehype
: Un procesador de HTML basado en plugins

Unified
: Una interfaz para procesar contenido con árboles de sintaxis
: La base tanto de remark como de rehype

## Abreviaturas [#abbreviations]

Añade descripciones emergentes a las abreviaturas con la directiva `:abbr`:

```md
The :abbr[HTML]{title="HyperText Markup Language"} standard is maintained by :abbr[W3C]{title="World Wide Web Consortium"}.
```

Se renderiza así:

El estándar :abbr[HTML]{title="HyperText Markup Language"} lo mantiene el :abbr[W3C]{title="World Wide Web Consortium"}.

## Emoji [#emoji]

Usa los códigos cortos de emoji al estilo de GitHub:

```md
:rocket: Launch :tada: Celebrate :heart: Love :warning: Careful :white_check_mark: Done
```

Se renderiza así:

:rocket: Lanzar :tada: Celebrar :heart: Amor :warning: Cuidado :white_check_mark: Hecho

Consulta la [lista completa de emoji](https://github.com/ikatyang/emoji-cheat-sheet) para ver los códigos cortos disponibles.
