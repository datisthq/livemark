---
title: Rutas personalizadas
description: Crea páginas nuevas en .livemark/routes/ junto a tu contenido Markdown.
path: /customization/custom-routes/
icon: route
order: 7
---

# Rutas personalizadas

Livemark se basa en [TanStack Router](https://tanstack.com/router). Cualquier archivo `.tsx` que pongas en `.livemark/routes/` se convierte en una página en la URL correspondiente, sin registro ni cambios de configuración.

## Ejemplo mínimo [#minimal-example]

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Layout } from "livemark/components/Layout"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16 prose">
        <h1>About</h1>
        <p>Anything you'd write in a normal React page, here.</p>
      </div>
    </Layout>
  )
}
```

Guarda y visita `/about/`. `Layout` le da a la página la misma interfaz que a un artículo: banner, cabecera, navegación y selector de modo oscuro.

## Elegir la interfaz [#choosing-the-chrome]

Una ruta personalizada empieza **vacía**: no se dibuja nada a su alrededor hasta que lo añades. Compón tanto como necesite la página:

| Lo que renderizas           | Lo que obtienes                                                     |
| --------------------------- | ------------------------------------------------------------------- |
| `<Layout>`                  | banner, cabecera, hoja de navegación en móvil, volver arriba        |
| `<Layout withSidebar>`      | lo anterior más la barra lateral de artículos                       |
| `<Banner />` + `<Header />` | solo el banner y la cabecera; en móviles, un menú con las secciones |
| nada                        | una página en blanco, toda tuya                                     |

Una página de inicio normalmente solo necesita la cabecera:

```tsx title=".livemark/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main>{/* your hero */}</main>
    </>
  )
}
```

## Cómo encaja con el resto del sitio [#how-it-fits-with-the-rest-of-the-site]

- **Las rutas exactas ganan.** Las rutas personalizadas tienen prioridad sobre la ruta comodín que sirve los artículos Markdown. Si creas `/about`, un artículo `docs/about.md` en la misma ruta queda inaccesible.
- **La ruta raíz `/`.** Coloca `.livemark/routes/index.tsx` para reemplazar la página de inicio por defecto por la tuya. El sitio por defecto de Livemark tiene una página de inicio en Markdown; sobrescribirla te da control total en React sobre la portada.
- **Rutas anidadas.** Las rutas de archivo reflejan las rutas URL: `.livemark/routes/guide/quickstart.tsx` ⇒ `/guide/quickstart/`.
- **Prerenderizadas por sí mismas.** `livemark build` escribe en disco cada ruta personalizada sin parámetro `$`, aunque ninguna página enlace a ella. Una ruta con parámetro solo se escribe para las URL a las que enlazan otras páginas.
- **Las etiquetas del head vienen incluidas.** Una ruta personalizada recibe el título y la descripción del sitio, un enlace canónico y `og:url` (con `site` configurado) y, en un sitio multilingüe, `og:locale` y enlaces `hreflang`, en el idioma bajo cuya ruta está. Un `head` en la ruta puede sobrescribir el título y las etiquetas meta.

## Importar primitivas de Livemark [#importing-livemark-primitives]

Reutiliza los mismos componentes que Livemark usa internamente mediante los exports de subruta `livemark/*`:

```tsx title=".livemark/routes/about.tsx"
import { createFileRoute, Link } from "@tanstack/react-router"
import { buttonVariants } from "livemark/elements/button"
import { cn } from "cn"

export const Route = createFileRoute("/about")({ component: About })

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <Link to="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
        ← Back home
      </Link>
    </main>
  )
}
```

## Recursos estáticos [#static-assets]

Los archivos colocados en `.livemark/public/` se sirven en la raíz del sitio. Pon ahí un `robots.txt`, un `favicon.svg` personalizado o un `/og-image.png`.

## Ver también [#see-also]

- [Sobrescritura/Escape](/es/customization/overriding-escaping/): reemplaza una página o un componente integrado en lugar de añadir uno nuevo.
- [Metadatos del sitio](/es/customization/site-metadata/): el título del sitio y el favicon, que también aparecen en las rutas personalizadas.
