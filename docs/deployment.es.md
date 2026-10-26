---
title: Despliegue
description: Cómo publicar tu sitio Livemark compilado en un hosting.
path: /deployment/
icon: cloud-upload
order: 5
---

# Despliegue

`livemark build` produce un sitio totalmente estático en `.livemark/build/client/`: archivos `index.html` para cada ruta, además de `sitemap.xml`, `robots.txt`, feeds RSS (si están configurados), [gemelos Markdown y `llms.txt`](/es/customization/ai-agents/) y tus recursos. Sube ese directorio a cualquier hosting estático y ya está en línea.

Estas guías recorren los destinos más habituales. Elige uno: cada guía es independiente y muestra tanto el comando manual como un flujo de CI.

## Hostings [#hosts]

:::card{title="Hosting estático" href="/es/deployment/static-hosting/" icon="server"}
Cualquier hosting que sirva un directorio de archivos: nginx, S3 + CloudFront, Caddy y similares.
:::

:::card{title="GitHub Pages" href="/es/deployment/github-pages/" icon="github"}
Gratuito, nativo de git y funciona bien para sitios de proyecto bajo una ruta `/repo-name/`.
:::

:::card{title="Cloudflare" href="/es/deployment/cloudflare/" icon="cloud"}
Workers + recursos estáticos. La configuración que usa el propio `livemark.dev`.
:::

:::card{title="Vercel" href="/es/deployment/vercel/" icon="triangle"}
Conectado a git, con vistas previas por cada pull request y dominios sin configuración.
:::

:::card{title="Netlify" href="/es/deployment/netlify/" icon="globe"}
Conectado a git, con despliegues por rama, publicaciones atómicas y gestión de formularios integrada.
:::

## Lo que asume cada guía [#what-every-guide-assumes]

- Ejecutas `livemark build` y la salida queda en `.livemark/build/client/`.
- Has definido `site` en `livemark.config.ts` si quieres que el sitemap, robots.txt y RSS se generen con URLs absolutas; consulta [Metadatos del sitio](/es/customization/site-metadata/).
- Solo necesitas `base` si tu sitio se monta en una subruta (p. ej., sitios de proyecto de GitHub Pages). La guía de [GitHub Pages](/es/deployment/github-pages/) es la única que lo trata.
