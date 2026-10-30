---
title: Skills para agentes
description: Enseña a tu agente de programación a escribir, configurar y personalizar un sitio de Livemark.
path: /agent-skills/
icon: sparkles
order: 2
---

# Skills para agentes

Livemark incluye [Agent Skills](https://agentskills.io/) que explican a agentes de programación como Claude Code, Cursor y Codex cómo funciona un proyecto de Livemark. Una vez instaladas, tu agente sabe dónde van los artículos, qué opciones de configuración existen, cómo sobrescribir la interfaz, cómo diseñar una página de inicio y cómo desplegar el sitio. No tienes que explicarle nada de eso en el prompt.

| Skill                    | Tu agente la usa al                                                     |
| ------------------------ | ----------------------------------------------------------------------- |
| `livemark-authoring`     | añadir o editar artículos Markdown, frontmatter, imágenes y patches     |
| `livemark-configuration` | editar `livemark.config.ts`: metadatos, globs, secciones, navegación    |
| `livemark-customization` | cambiar el tema, escapar componentes o añadir rutas personalizadas      |
| `livemark-landing`       | diseñar la página de inicio, tomando la de livemark.dev como referencia |
| `livemark-deployment`    | publicar la compilación en Cloudflare, GitHub Pages, Vercel o Netlify   |

## Instalar desde el sitio web {#install-from-the-website}

livemark.dev publica sus skills en `/.well-known/agent-skills/`, así que la [CLI `skills`](https://github.com/vercel-labs/skills) puede instalarlas desde la URL del sitio. Ejecuta esto en la raíz de tu proyecto:

```bash
npx skills add https://livemark.dev
```

Te pregunta qué skills instalar y para qué agentes. Para saltarte las preguntas, pásalas como flags:

```bash
npx skills add https://livemark.dev --skill livemark-authoring --agent claude-code
```

Añade `--global` para instalarlas para tu usuario en lugar de para el proyecto, y `--list` para ver qué hay disponible sin instalar nada. Ejecuta `npx skills update` más adelante para obtener versiones más recientes.

## Instalar desde el paquete {#install-from-the-package}

Las skills también se incluyen dentro del paquete de npm. Instalarlas desde ahí las mantiene alineadas con la versión de Livemark de tu lockfile, mientras que el sitio web siempre sirve la última versión:

```bash
npx skills add ./node_modules/livemark/skills
```

## Usarlas {#use-them}

No necesitas invocar una skill tú mismo. Los agentes leen la descripción de cada skill y la cargan cuando una tarea encaja. Por ejemplo, pedir una nueva sección de blog carga `livemark-configuration`, y pedir un nuevo artículo carga `livemark-authoring`. Si tu agente permite invocar skills por nombre, también puedes llamar a una directamente, como con `/livemark-customization` en Claude Code.

## Ver también {#see-also}

- [Agentes de IA](/es/customization/ai-agents/#agent-skills) — publica las skills de tu propio proyecto de la misma forma.
