---
title: Vercel
description: Despliega con la integración git de Vercel o su CLI, con URLs de vista previa por cada PR.
path: /deployment/vercel/
icon: triangle
order: 4
---

# Vercel

Vercel detecta Vite automáticamente, pero no adivina el directorio de compilación no estándar de Livemark. Basta con un `vercel.json` de dos líneas.

:::note
Esta guía publica la salida estática prerenderizada. Livemark está construido sobre [TanStack Start](https://tanstack.com/start), que también admite SSR totalmente dinámico mediante el preset de Vercel: `.livemark/build/` se convierte en una función serverless desplegable. Consulta [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) para hacer el cambio.
:::

## Compila el sitio [#build-the-site]

```bash
livemark build
```

La salida queda en `.livemark/build/client/`.

## Configura `vercel.json` [#configure-verceljson]

Coloca esto en la raíz de tu proyecto para que Vercel use el comando correcto y sirva el directorio correcto:

```json title="vercel.json"
{
  "buildCommand": "livemark build",
  "outputDirectory": ".livemark/build/client"
}
```

Esa es toda la configuración: Vercel se encarga a partir de ahí de la instalación, la compilación y el servicio estático.

## Despliega con la integración git [#deploy-with-the-git-integration]

El camino recomendado: importa tu repositorio en [vercel.com/new](https://vercel.com/new). Vercel detecta Vite como framework (Livemark se construye sobre Vite + TanStack Start), lee `vercel.json` y ejecuta el mismo `livemark build` que ejecutarías en local. Cada push a `main` va a producción; cualquier otra rama y PR recibe una URL de vista previa única.

## Despliega con la CLI [#deploy-with-the-cli]

Para despliegues puntuales o automatizados con scripts:

```bash
livemark build
vercel deploy --prod
```

La primera ejecución te pide `vercel login` y vincula el directorio a un proyecto de Vercel.

## Despliega con GitHub Actions [#deploy-with-github-actions]

La integración git de Vercel suele bastar por sí sola, pero puedes condicionar los despliegues a las pruebas de CI:

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: pnpm test
      - run: npm install --global vercel
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

`vercel build` ejecuta el `buildCommand` de `vercel.json` (`livemark build`) y empaqueta `.livemark/build/client/` en `.vercel/output/`, que `vercel deploy --prebuilt` sube tal cual. Necesitarás `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` como secretos (los dos últimos están en `.vercel/project.json` tras el primer `vercel link` en local).

## Dominio personalizado [#custom-domain]

En el panel del proyecto, **Settings → Domains → Add**. Vercel te guía por los registros DNS y aprovisiona un certificado automáticamente. Define el mismo dominio como `site` en `livemark.config.ts`.

## Ver también [#see-also]

- [Metadatos del sitio](/es/customization/site-metadata/): `site` rellena las URLs del sitemap y del feed RSS.
- [Despliegue](/es/deployment/): vuelve al índice de hostings.
