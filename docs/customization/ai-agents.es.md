---
title: Agentes de IA
description: Sirve Markdown, llms.txt, señales de contenido y skills de agente a los agentes de IA.
path: /customization/ai-agents/
icon: bot
order: 11
---

# Agentes de IA

Cada `livemark build` publica tu sitio en los formatos que buscan los agentes de IA, junto al HTML que reciben los navegadores. No necesitas configurar nada para ello. Las dos opciones de abajo solo lo ajustan.

## Qué genera la compilación [#what-the-build-emits]

| Archivo                                | Propósito                                                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `<page>/index.md`                      | Un gemelo en Markdown de cada artículo y listado de sección, junto a su `index.html`                  |
| `/llms.txt`                            | Un índice [llms.txt](https://llmstxt.org/) que enlaza todos los gemelos, agrupados por sección        |
| `/index.md`                            | El gemelo de la página de inicio, o una copia de `llms.txt` si no hay ningún artículo en `/`          |
| `/robots.txt`                          | Añade una línea `Content-Signal` que indica cómo pueden usar tu contenido los sistemas automatizados  |
| `/_headers`                            | Una cabecera `Link` en la página de inicio que apunta a `llms.txt`, `index.md` y al índice de skills  |
| `/.well-known/agent-skills/index.json` | Un índice de descubrimiento de [Agent Skills](https://agentskills.io/), cuando `skills` está definido |

Cada página de artículo incluye además `<link rel="alternate" type="text/markdown">` apuntando a su gemelo.

Un archivo con el mismo nombre que incluyas en `.livemark/public/` reemplaza al generado. `_headers` es la única excepción: tus reglas se conservan y la regla `Link` generada se añade después de ellas. Los archivos solo los escribe `livemark build`, así que `livemark start` no los sirve.

## Señales de contenido [#content-signals]

`contentSignals` controla la línea de [Content Signals](https://contentsignals.org/) en `robots.txt`. Las tres señales son `true` por defecto:

```ts title="livemark.config.ts"
export default defineConfig({
  contentSignals: {
    search: true, // build a search index and show links to your pages
    aiInput: true, // feed pages to a model answering a question in real time
    aiTrain: false, // train or fine-tune models on your content
  },
})
```

La línea que produce va en el grupo `User-agent: *`: `Content-Signal: search=yes, ai-input=yes, ai-train=no`.

## Skills de agente [#agent-skills]

Si tu proyecto incluye [Agent Skills](https://agentskills.io/specification), apunta `skills` a sus archivos `SKILL.md`:

```ts title="livemark.config.ts"
export default defineConfig({
  skills: "skills/*/SKILL.md",
})
```

Cada skill encontrada se publica en `/.well-known/agent-skills/<name>/SKILL.md` y se lista en `index.json` con un digest `sha256`. Su frontmatter necesita un `name` (letras minúsculas, dígitos y guiones simples) y una `description`, y la compilación falla si falta alguno.

## Markdown bajo petición [#markdown-on-request]

Los agentes piden Markdown enviando `Accept: text/markdown` a la URL de la página. Un hosting estático no puede responder a eso por sí solo, pero una reescritura en tu CDN puede servir `<page>/index.md` para esas peticiones y dejar el HTML para todos los demás. Cada artículo y listado de sección tiene un gemelo, así que la reescritura nunca apunta a un archivo inexistente. Para una regla lista para usar, consulta [Cloudflare → Markdown para agentes](/es/deployment/cloudflare/#markdown-for-agents).

## Usar la CLI [#driving-the-cli]

El propio comando `livemark` está pensado para agentes y scripts además de personas. `livemark --llms` imprime un manifiesto con cada comando como herramienta al estilo de [MCP](https://modelcontextprotocol.io/), cada una con un JSON Schema para su entrada y su salida. Añade `--json` a cualquier comando para obtener su resultado como JSON en stdout, y pasa un valor para dar también la entrada en JSON:

```bash
livemark --llms                                          # cada comando y sus esquemas
livemark build --json                                    # → { "outDir": ".../.livemark/build/client" }
livemark escape --json '{"paths":["components/Footer.tsx"]}'
```

Con `--json`, los registros van a stderr, así que stdout contiene solo el resultado. `start` y `preview` imprimen sus URL en cuanto el servidor escucha y siguen en marcha. `--config` (`-c`) o la variable `LIVEMARK_CONFIG` apuntan cualquier comando a una configuración distinta de `./livemark.config.ts`.

## Ver también [#see-also]

- [Agent Skills](/es/agent-skills/): instala las skills propias de Livemark en tu agente de programación.
- [Archivo de configuración](/es/customization/config-file/): todas las opciones de nivel superior.
- [Rutas personalizadas](/es/customization/custom-routes/): archivos estáticos en `.livemark/public/`.
