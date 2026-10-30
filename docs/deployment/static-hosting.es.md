---
title: Hosting estático
description: "Sirve el directorio de compilación desde cualquier hosting estático: nginx, S3 + CloudFront, Caddy y similares."
path: /deployment/static-hosting/
icon: server
order: 1
---

# Hosting estático

La compilación de Livemark es un simple directorio de archivos `.html`, `.css`, `.js` y recursos. Cualquier cosa capaz de servir un directorio de archivos funcionará. Esta guía cubre las configuraciones habituales.

## Compila el sitio {#build-the-site}

```bash
livemark build
```

La salida queda en `.livemark/build/client/`. Trata ese directorio como la raíz de documentos.

## Prerenderizado frente a fallback SPA {#prerendering-vs-spa-fallback}

Livemark prerenderiza cada ruta en disco durante `livemark build`. Un enlace profundo como `/customization/site-metadata/` cae en un archivo real en `customization/site-metadata/index.html`, sin necesidad de un fallback de enrutado en el cliente para las páginas conocidas.

Aun así, conviene configurar el fallback SPA (reescribir las rutas desconocidas a `index.html`) como defensa en profundidad: da a los 404 un renderizado elegante en el cliente en lugar de la página de error por defecto del hosting.

## nginx

```nginx title="/etc/nginx/conf.d/docs.conf"
server {
  listen 80;
  server_name docs.example.com;
  root /var/www/docs;

  # Try the exact file, then a directory's index.html, then SPA fallback.
  location / {
    try_files $uri $uri/index.html /index.html =404;
  }

  # Long-cache hashed assets.
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

Copia `.livemark/build/client/*` a `/var/www/docs/` en cada publicación.

## Caddy

```caddy title="Caddyfile"
docs.example.com {
  root * /var/www/docs
  try_files {path} {path}/index.html /index.html
  file_server
  encode gzip zstd
}
```

Caddy aprovisiona automáticamente certificados de Let's Encrypt cuando el dominio resuelve hacia él.

## AWS S3 + CloudFront

El patrón estándar es un bucket de S3 como origen y CloudFront delante:

1. Sube `.livemark/build/client/` a un bucket de S3 (`aws s3 sync .livemark/build/client/ s3://my-docs --delete`).
2. Define **Static website hosting → Index document** como `index.html`.
3. Crea una distribución de CloudFront que apunte al bucket.
4. En CloudFront, añade una **Custom error response** que asigne `404` a `/index.html` con código de respuesta `200`. Este es el fallback SPA para rutas desconocidas.
5. Define el objeto raíz por defecto de la distribución como `index.html`.

Para controlar la caché larga de los recursos con hash, añade una política de caché que respete las cabeceras `Cache-Control` definidas en los objetos `/assets/*`.

## Apache

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Coloca la compilación en la raíz de documentos. Las dos `RewriteCond` garantizan que los archivos y directorios reales se sirvan directamente; solo las rutas sin coincidencia recurren al fallback.

## Otros hostings {#other-hosts}

La misma receta funciona en Render Static, Surge, Fly Static, Bunny o cualquier almacenamiento de objetos con CDN: sube el directorio, apunta un dominio a él y asegúrate de que las rutas desconocidas recurran a `index.html`.

## Despliega con GitHub Actions {#deploy-with-github-actions}

Un ejemplo mínimo con nginx/SSH:

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
      - run: pnpm livemark build
      - uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SSH_HOST }}
          REMOTE_USER: ${{ secrets.SSH_USER }}
          SOURCE: .livemark/build/client/
          TARGET: /var/www/docs/
          ARGS: -avzr --delete
```

Para S3, sustituye el paso de despliegue por `aws-actions/configure-aws-credentials` + `aws s3 sync`.

## Ver también {#see-also}

- [Metadatos del sitio](/es/customization/site-metadata/): `site` hace posibles las URLs absolutas y la generación de feeds.
- [Despliegue](/es/deployment/): vuelve al índice de hostings.
