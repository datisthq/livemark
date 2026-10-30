---
title: Enlaces
path: /authoring/links/
icon: link
order: 3
---

# Enlaces

## Enlaces internos {#internal-links}

Enlaza a otras páginas de tu documentación:

```md
[Getting Started](/introduction/)
```

Se renderiza así: [Primeros pasos](/es/introduction/)

## Enlaces externos {#external-links}

Enlaza a recursos externos:

```md
[GitHub](https://github.com)
```

Se renderiza así: [GitHub](https://github.com)

## Enlaces a anclas {#anchor-links}

Enlaza a un encabezado concreto: en la página actual solo con el `#id`, en otra página tras su ruta:

```md
[See Auto Links](#auto-links)
[See Custom Heading IDs](/es/authoring/headings/#custom-ids)
```

Se renderiza así: [Ver Enlaces automáticos](#auto-links) y [Ver IDs de encabezado personalizados](/es/authoring/headings/#custom-ids)

## Enlaces automáticos {#auto-links}

Las URL se convierten automáticamente en enlaces:

```md
https://github.com/datisthq/livemark
```

Se renderiza así: https://github.com/datisthq/livemark
