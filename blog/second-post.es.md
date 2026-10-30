---
title: Secciones y soporte de blog
description: Presentamos las secciones configurables y el soporte de blog en Livemark
author: Livemark Team
date: 2026-04-15
path: /blog/sections-and-blog-support/
tags: [features, announcement]
---

# Secciones y soporte de blog

Acabamos de lanzar dos funcionalidades importantes: secciones configurables y soporte de blog.

## Secciones {#sections}

Ahora puedes dividir tu sitio en varias secciones. Cada sección aparece como una pestaña en la cabecera, y la barra lateral muestra solo los artículos de la sección activa.

```ts
export default defineConfig({
  sections: [
    { title: "Docs", prefix: "/" },
    { title: "Blog", prefix: "/blog/", type: "blog" },
  ],
})
```

## Blog {#blog}

Las secciones de blog tienen un diseño de barra lateral distinto, optimizado para entradas cronológicas, y una página de índice generada automáticamente que lista todas las entradas por fecha.
