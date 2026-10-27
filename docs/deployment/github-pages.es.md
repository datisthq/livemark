---
title: GitHub Pages
description: Despliega tu sitio en GitHub Pages, incluidos los sitios de proyecto bajo una subruta.
path: /deployment/github-pages/
icon: github
order: 2
---

# GitHub Pages

GitHub Pages sirve un directorio de archivos estáticos con una de dos formas de URL:

- **Sitio de usuario u organización**: `https://<user>.github.io/`, servido desde un repositorio llamado `<user>.github.io`. Sin subruta.
- **Sitio de proyecto**: `https://<user>.github.io/<repo>/`, servido desde cualquier otro repositorio. El prefijo `/<repo>/` importa: las rutas y las URLs de los recursos deben incluirlo.

## Compila el sitio [#build-the-site]

```bash
livemark build
```

La salida queda en `.livemark/build/client/`.

## Configura `base` para sitios de proyecto [#configure-base-for-project-sites]

Si publicas bajo `https://<user>.github.io/<repo>/`, define el campo `base` para que cada ruta y URL de recurso lleve el prefijo correcto. La forma de función mantiene simple el desarrollo: `livemark start` sigue sirviendo en `/` y solo la compilación de producción se monta bajo `/<repo>/`:

```typescript title="livemark.config.ts"
import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://acme.github.io/my-docs",
  base: command => (command === "build" ? "/my-docs" : undefined),
})
```

Para sitios de usuario u organización en la raíz, omite `base` por completo.

:::tip
Los dominios personalizados omiten la subruta `/<repo>/` incluso en sitios de proyecto. Si asocias un dominio como `docs.example.com`, deja `base` sin definir y define `site` con el dominio final.
:::

## Despliega manualmente [#deploy-manually]

El despliegue puntual más sencillo usa el paquete [`gh-pages`](https://www.npmjs.com/package/gh-pages):

```bash
livemark build
gh-pages -d .livemark/build/client
```

Esto sube la compilación a la rama `gh-pages`. En la configuración de tu repositorio, define **Pages → Source** como "Deploy from a branch" y elige `gh-pages` / `/ (root)`.

## Despliega con GitHub Actions [#deploy-with-github-actions]

Las acciones oficiales de Pages son el camino más limpio: sin rama adicional ni tokens de servicio:

```yaml title=".github/workflows/deploy.yaml"
name: deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          cache: pnpm
          node-version: 24
      - run: pnpm install
      - run: pnpm livemark build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .livemark/build/client

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

Define **Pages → Source** como "GitHub Actions" en la configuración de tu repositorio.

## Dominio personalizado [#custom-domain]

Añade un archivo `CNAME` con tu dominio en `.livemark/public/`:

```text title=".livemark/public/CNAME"
docs.example.com
```

Todo lo que hay en `.livemark/public/` se copia tal cual a la salida de compilación, así que el archivo acaba en la raíz de tu despliegue. Configura el DNS en tu registrador (un registro `CNAME` que apunte a `<user>.github.io`) y define el dominio en **Pages → Custom domain**.

## Ver también [#see-also]

- [Metadatos del sitio](/es/customization/site-metadata/): `site` es necesario para las URLs absolutas en el sitemap, RSS y las etiquetas Open Graph.
- [Despliegue](/es/deployment/): vuelve al índice de hostings.
