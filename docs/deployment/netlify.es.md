---
title: Netlify
description: Despliega con la integración git de Netlify o su CLI, con vistas previas por rama y publicaciones atómicas.
path: /deployment/netlify/
icon: globe
order: 5
---

# Netlify

Netlify lee un pequeño `netlify.toml` en la raíz de tu proyecto para obtener el comando de compilación y el directorio de publicación. El resto (vistas previas de Git, despliegues atómicos, dominios personalizados) se gestiona automáticamente.

:::note
Esta guía publica la salida estática prerenderizada. Livemark está construido sobre [TanStack Start](https://tanstack.com/start), que también admite SSR totalmente dinámico mediante el preset de Netlify: `.livemark/build/` se convierte en una función de Netlify desplegable. Consulta [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) para hacer el cambio.
:::

## Compila el sitio [#build-the-site]

```bash
livemark build
```

La salida queda en `.livemark/build/client/`.

## Configura `netlify.toml` [#configure-netlifytoml]

```toml title="netlify.toml"
[build]
command = "livemark build"
publish = ".livemark/build/client"
```

Es todo lo que Netlify necesita. El mismo archivo habilita `netlify dev` en local si alguna vez quieres reproducir el comportamiento en el edge de la plataforma.

## Despliega con la integración git [#deploy-with-the-git-integration]

El camino recomendado: conecta tu repositorio en [app.netlify.com/start](https://app.netlify.com/start). Netlify lee `netlify.toml`, ejecuta la compilación y lleva a producción cada push a `main`. Las demás ramas y PR reciben automáticamente URLs de vista previa únicas.

## Despliega con la CLI [#deploy-with-the-cli]

Para despliegues puntuales o automatizados con scripts:

```bash
livemark build
netlify deploy --prod --dir=.livemark/build/client
```

La primera ejecución te pide `netlify login` y vincula el directorio a un sitio.

## Despliega con GitHub Actions [#deploy-with-github-actions]

La integración git de Netlify suele bastar, pero un flujo de trabajo te permite condicionar el despliegue a que pasen las pruebas:

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: pnpm test
      - run: pnpm livemark build
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: .livemark/build/client
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Obtén el token de autenticación en **User settings → Applications → Personal access tokens**, y el ID del sitio en **Site settings → General**.

## Dominio personalizado [#custom-domain]

En el panel del sitio, **Domain management → Add a domain**. Netlify aprovisiona el DNS y un certificado. Define el mismo dominio como `site` en `livemark.config.ts`.

## Ver también [#see-also]

- [Metadatos del sitio](/es/customization/site-metadata/): `site` rellena las URLs del sitemap y del feed RSS.
- [Despliegue](/es/deployment/): vuelve al índice de hostings.
