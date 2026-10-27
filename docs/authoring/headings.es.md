---
title: Encabezados
path: /authoring/headings/
icon: heading
order: 2
---

# Encabezados

Los encabezados generan automáticamente IDs de ancla para enlazarlos.

## IDs generados automáticamente [#auto-generated-ids]

```md
## My Heading
```

Se renderiza como `<h2 id="my-heading">My Heading</h2>`. Los IDs se generan con un slug compatible con GitHub.

## IDs de encabezado personalizados [#custom-ids]

Sobrescribe el ID generado automáticamente con la sintaxis `[#custom-id]`:

```md
## My Heading [#custom-id]
```

Esto genera `<h2 id="custom-id">My Heading</h2>`. Enlázalo con `#custom-id`. Este mismo encabezado usa `[#custom-ids]`.

## Niveles de encabezado [#heading-levels]

Usa h2–h4 para estructurar el contenido. El h1 está reservado para el título de la página.

Los encabezados más profundos (h5, h6) se admiten, pero no aparecen en el índice.

## Control del índice [#toc-control]

Controla si los encabezados aparecen en el índice mediante anotaciones.

Oculta un encabezado del índice sin dejar de mostrarlo en la salida renderizada:

```md
## Visible Heading [!toc]
```

El encabezado se renderiza normalmente en la página, pero se excluye del índice.

Crea un encabezado solo para el índice, que aparece en el índice pero no en la salida renderizada:

```md
## Hidden Heading [toc]
```

El encabezado aparece en el índice para la navegación, pero se elimina del contenido de la página.

## Enlaces de ancla al pasar el cursor [#anchor-links-on-hover]

Los encabezados con ID muestran un icono de enlace al pasar el cursor. El texto del encabezado es un enlace a su propia ancla: haz clic y la barra de direcciones tendrá una URL que puedes compartir.

## Índice en línea [#inline-table-of-contents]

Inserta un índice en cualquier parte del contenido con la directiva `::toc`:

```md
::toc
```

Limita la profundidad con `maxLevel`:

```md
::toc{maxLevel=2}
```

Se renderiza así:

::toc{maxLevel=2}
