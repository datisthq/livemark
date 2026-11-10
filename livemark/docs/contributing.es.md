---
title: Contribuir
description: Cómo configurar Livemark en local, proponer cambios y publicar una versión.
icon: heart-handshake
path: /es/contributing/
order: -1
---

Livemark es un proyecto de código abierto y nos encantaría contar con tu ayuda, ya sea corrigiendo un bug, puliendo la documentación o proponiendo una nueva funcionalidad. Esta guía recorre todo lo que necesitas para llevar un cambio desde tu editor hasta una versión publicada.

## Inicio rápido {#quick-start}

Necesitarás [Node.js](https://nodejs.org/) 24+ y [pnpm](https://pnpm.io/) 11+. Después:

```bash
git clone https://github.com/datisthq/livemark.git
cd livemark
pnpm install
pnpm start
```

`pnpm start` arranca el servidor de desarrollo sobre el propio `livemark/docs/` de este repositorio, para que puedas iterar sobre Livemark mientras ves el resultado en tu navegador. Los cambios en `livemark/source/`, `markdown/source/` o `livemark/docs/` se recargan automáticamente.

## Estructura del repositorio {#repository-layout}

```
├── livemark/               # the `livemark` package: CLI, site and escapable UI
│   ├── source/             # its code (compiles into build/)
│   │   ├── actions/        # build-time orchestration (config, articles, changelog)
│   │   ├── commands/       # `livemark <cmd>` CLI entrypoints
│   │   ├── components/     # site React components (overridable via .livemark/)
│   │   ├── elements/       # shadcn-style primitives (overridable)
│   │   ├── helpers/        # internal utilities (private)
│   │   ├── hooks/          # public React hooks
│   │   ├── plugins/        # the site's Vite plugins
│   │   ├── routes/         # TanStack Start routes
│   │   ├── models/         # Zod schemas
│   │   ├── content/        # derivations over the loaded articles
│   │   └── vite.config.ts  # the Vite config consumers run against
│   ├── shims/              # `livemark/components/*` etc. for files that live in markdown/
│   ├── skills/             # agent skills shipped to people who install Livemark
│   ├── docs/               # livemark.dev's content (not published)
│   └── blog/               # livemark.dev's blog posts (not published)
├── markdown/               # the internal `@livemark/markdown` package
│   └── source/             # the Markdown pipeline, and the components, elements and
│                           # styles articles render with (overridable too)
├── vite/                   # the public `@livemark/vite` package
│   └── source/             # the Vite plugin and what apps import beside it
├── .scripts/               # repo tooling and repo-wide guards
└── livemark.config.ts      # livemark.dev's livemark config
```

Cada paquete incluye `source/` y `build/`: Node carga `build/*.js`, mientras que Vite empaqueta el TS sin compilar de `source/*` para que se resuelvan las extensiones `.ts` literales de los imports. Un sitio se ensambla con `markdown/source`, luego `livemark/source` encima y por último los escapes `.livemark/` del proyecto; ninguna ruta existe en ambos paquetes.

## Comandos locales {#local-commands}

| Comando            | Qué hace                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `pnpm start`       | Ejecuta el servidor de desarrollo sobre la documentación del repositorio |
| `pnpm build:docs`  | Compilación de producción del sitio de documentación                     |
| `pnpm build`       | Compila el `source/` de cada paquete → `build/`                          |
| `pnpm check:types` | Comprobación de tipos (sin emitir)                                       |
| `pnpm check:lint`  | Comprobación de formato + lint con vite-plus                             |
| `pnpm check`       | Lint + tipos                                                             |
| `pnpm format`      | Corrige el formato automáticamente                                       |
| `pnpm test:unit`   | Ejecuta las pruebas unitarias (Vitest)                                   |
| `pnpm test`        | Lint + tipos + unitarias                                                 |

Un cambio está listo para subir cuando `pnpm test` pasa en verde y `pnpm build:docs` termina con éxito.

## Convenciones de código {#code-conventions}

- **TypeScript**: el modo estricto está activado. No uses `any`, el cast `as` ni el `!` no nulo sin una razón clara; señálalo en la PR.
- **Imports**: usa rutas ESM completas con la extensión `.ts(x)` (`from "./foo.ts"`). Tsgo las reescribe a `.js` al emitir mediante `rewriteRelativeImportExtensions`.
- **Comentarios**: docstrings en los exports. Un comentario `//` debe nombrar el error que evita, no pasar de unas tres líneas, y los comentarios nunca superan en número al código; la justificación y la historia pertenecen a git.
- **Organización de archivos**: los elementos públicos de alto nivel arriba, los helpers privados abajo.
- **Pruebas**: coloca las pruebas unitarias en `<module>.unit.ts` junto al código. Sin comentarios "Arrange/Act/Assert": la estructura debe ser evidente.
- **Formato**: vite-plus mediante `pnpm format`. Sangría de 2 espacios, sin punto y coma, comillas dobles, 90 columnas.

## Proponer un cambio {#proposing-a-change}

1. **Abre primero un issue** para cualquier cosa mayor que una errata o un bug pequeño. Es mucho más fácil acordar la dirección antes de escribir código.
2. **Crea una rama desde `main`** con un nombre corto y descriptivo (p. ej., `fix-mobile-toc`, `feat-yaml-frontmatter`).
3. **Escribe un historial de commits enfocado**. Livemark usa [Conventional Commits](https://www.conventionalcommits.org/): el prefijo dirige release-please:
   - `fix:`: corrección de un bug en el paquete publicado → versión patch
   - `feat:`: nueva funcionalidad en el paquete publicado → versión minor
   - `chore:`, `docs:`, `refactor:`, `test:`: sin publicación; úsalos para CI, herramientas, dependencias, el sitio de documentación y cualquier otra cosa que quien instala el paquete nunca ve
   - nunca marques un commit como breaking (`!` o un pie `BREAKING CHANGE:`) sin que un mantenedor acepte una versión major
4. **Ejecuta `pnpm test` y `pnpm build:docs`** antes de hacer push.
5. **Abre una PR** contra `main`. Describe el _porqué_ (enlaza el issue), incluye capturas de pantalla para cualquier cambio de UI y señala todo aquello a lo que los revisores deban prestar especial atención.

## Publicaciones {#releases}

Las publicaciones las dirige [release-please](https://github.com/googleapis/release-please). Un `feat` o `fix` que llega a `main` abre una Release PR con la versión y el registro de cambios calculados; al fusionar esa PR se crea la etiqueta, se publica el paquete y se crea la release de GitHub. Los mantenedores nunca suben versiones a mano: release-please mantiene `.release/manifest.json`.

## Dónde encontrar ayuda {#where-to-find-help}

- **Bugs y solicitudes de funcionalidades**: [GitHub Issues](https://github.com/datisthq/livemark/issues)
- **Debate / ideas**: [GitHub Discussions](https://github.com/datisthq/livemark/discussions)
- **Código fuente**: [github.com/datisthq/livemark](https://github.com/datisthq/livemark)

Gracias por ayudar a mejorar Livemark.
