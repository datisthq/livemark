---
title: Cloudflare
description: Despliega con Cloudflare Workers y recursos estáticos, la configuración que usa el propio livemark.dev.
path: /deployment/cloudflare/
icon: cloud
order: 3
---

# Cloudflare

Cloudflare Workers puede servir directamente un directorio de recursos estáticos: sin cómputo aparte ni capa SPA. Así se publica `livemark.dev`, y la misma estructura de `wrangler.jsonc` funciona para cualquier sitio Livemark.

:::note
Esta guía publica la salida estática prerenderizada. Livemark está construido sobre [TanStack Start](https://tanstack.com/start), que también admite SSR totalmente dinámico en Cloudflare Workers mediante un preset de Nitro: `.livemark/build/` se convierte en un bundle de Worker desplegable. Consulta [TanStack Start → Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) para hacer el cambio.
:::

## Compila el sitio [#build-the-site]

```bash
livemark build
```

La salida queda en `.livemark/build/client/`.

## Configura `wrangler.jsonc` [#configure-wranglerjsonc]

Coloca esto en la raíz de tu proyecto:

```jsonc title="wrangler.jsonc"
{
  "name": "my-docs",
  "compatibility_date": "2026-04-01",
  "workers_dev": true,
  "assets": {
    "directory": ".livemark/build/client",
  },
}
```

Dos campos hacen el trabajo pesado:

| Campo              | Propósito                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- |
| `assets.directory` | Apunta Wrangler a la salida de compilación de Livemark. Cada archivo se sirve tal cual. |
| `workers_dev`      | Te da una URL de vista previa `<name>.<account>.workers.dev` mientras pruebas.          |

## Despliega desde tu máquina [#deploy-from-your-machine]

```bash
livemark build
wrangler deploy
```

La primera ejecución te pide `wrangler login` para autorizar el acceso a tu cuenta de Cloudflare.

## Despliega con GitHub Actions [#deploy-with-github-actions]

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
      - run: livemark build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Crea un token de API con alcance limitado en **My Profile → API Tokens** (la plantilla "Edit Cloudflare Workers" concede exactamente lo que necesitas) y guarda ambos valores como secretos del repositorio.

## Dominio personalizado [#custom-domain]

Añade un bloque `routes` cuando tu zona esté en Cloudflare:

```jsonc title="wrangler.jsonc"
{
  "name": "my-docs",
  "compatibility_date": "2026-04-01",
  "assets": { "directory": ".livemark/build/client" },
  "routes": [{ "pattern": "docs.example.com", "custom_domain": true }],
}
```

`custom_domain: true` indica a Cloudflare que aprovisione un dominio gestionado: DNS, certificado y ruta se gestionan por ti. Define `site` con el mismo dominio en `livemark.config.ts` para que las URLs absolutas del sitemap y los feeds RSS coincidan.

:::tip
El propio `wrangler.jsonc` del repositorio de Livemark es una referencia que funciona; consulta la [raíz del proyecto](https://github.com/datisthq/livemark/blob/main/wrangler.jsonc).
:::

## Markdown para agentes [#markdown-for-agents]

Los agentes de IA piden una página como Markdown enviando `Accept: text/markdown`. Los recursos estáticos siempre responden con HTML, así que añade a tu zona una URL Rewrite Rule que dirija esas peticiones al [gemelo Markdown](/es/customization/ai-agents/) de la página. Las URL Rewrite Rules están disponibles en todos los planes, incluido el gratuito, y el sitio sigue siendo totalmente estático.

En el panel, abre tu dominio, ve a **Rules → Overview → Create rule → URL Rewrite Rule** y rellena:

| Campo                      | Valor                                                                  |
| -------------------------- | ---------------------------------------------------------------------- |
| Rule name                  | `Markdown for agents`                                                  |
| If incoming requests match | Custom filter expression (abajo)                                       |
| Path                       | Rewrite to → **Dynamic** → `concat(http.request.uri.path, "index.md")` |
| Query                      | Preserve                                                               |

```txt title="Filter expression"
any(http.request.headers["accept"][*] contains "text/markdown") and ends_with(http.request.uri.path, "/")
```

Las URLs de las páginas terminan en `/`, así que la regla solo afecta a las páginas. Una petición a `/guide` se redirige primero a `/guide/` y luego se reescribe. Los recursos estáticos sirven los archivos `.md` como `text/markdown`, así que el tipo de respuesta no necesita ninguna regla adicional.

:::warning
Despliega una compilación que contenga los gemelos antes de activar la regla. De lo contrario, un agente que pida Markdown recibirá un 404.
:::

## Ver también [#see-also]

- [Agentes de IA](/es/customization/ai-agents/): lo que la compilación publica para los agentes.

- [Metadatos del sitio](/es/customization/site-metadata/): `site` hace posibles las URLs absolutas y la generación de feeds.
- [Despliegue](/es/deployment/): vuelve al índice de hostings.
