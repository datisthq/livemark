/** A piece of landing text: plain, inline code, or a link to a site page by its path. */
export type RichSegment = string | { code: string } | { link: string; text: string }

const rich = (...segments: RichSegment[]) => segments

const en = {
  hero: {
    eyebrow: "For TypeScript",
    titleLines: ["Beautiful", "Markdown sites,"],
    titleHighlight: "your way.",
    description:
      "Keep your files where they are, add TanStack Start pages, restyle everything with Tailwind, and get docs, a blog and a changelog that shine on every screen.",
    getStarted: "Get started",
    viewSource: "View source",
    sourceLabel: "Written in plain Markdown",
  },
  slides: {
    docs: {
      title: "Docs",
      alts: [
        "A Livemark docs page with a sidebar, a highlighted code block and a table of contents",
      ],
    },
    blog: {
      title: "Blog",
      alts: ["A Livemark blog index listing posts with dates, authors and tags"],
    },
    changelog: {
      title: "Changelog",
      alts: ["A Livemark changelog listing releases with their dates"],
    },
    mobile: {
      title: "Mobile",
      alts: [
        "The Livemark sidebar open on a phone, with the section picker and articles",
        "A Livemark docs page on a phone, showing note, tip, warning and danger callouts",
        "The page contents open as a bottom sheet on a phone",
      ],
    },
  },
  freedom: {
    title: "Stays out of your way",
    description:
      "No required folder structure, no lock-in. Livemark adapts to your repo, not the other way round.",
    repoLabel: "your-repo",
    points: {
      layout: {
        title: "Any file layout",
        description: rich(
          "Point ",
          { code: "include" },
          " globs at the Markdown you already have. README, CONTRIBUTING and CHANGELOG become pages too.",
        ),
      },
      pages: {
        title: "Real TanStack Start pages",
        description: rich(
          "Drop a ",
          { code: ".tsx" },
          " file into ",
          { code: ".livemark/routes/" },
          " for pricing, dashboards or anything else. This landing page is one.",
        ),
      },
      tailwind: {
        title: "Tailwind, fully customizable",
        description: rich(
          "Built on Tailwind v4 and shadcn-style primitives. Restyle with CSS tokens, use utilities in your own pages, or ",
          { link: "customization/overriding-escaping", text: "escape any component" },
          " under ",
          { code: ".livemark/" },
          ".",
        ),
      },
    },
  },
  features: {
    title: "Beautiful by default",
    description:
      "Rich Markdown, a polished mobile experience and sensible defaults. Customize only what you want.",
    items: {
      shiki: {
        title: "Shiki syntax highlighting",
        description:
          "100+ languages, Catppuccin themes, diffs, line highlights, and TwoSlash type hints out of the box.",
      },
      diagrams: {
        title: "Diagrams & math",
        description:
          "Mermaid flowcharts and KaTeX equations, theme-aware, zero config. Just write them in your Markdown.",
      },
      syntax: {
        title: "Rich Markdown syntax",
        description:
          "Callouts, tabs, steps, cards, file trees and badges as plain directives — and MDX components when you need more.",
      },
      translations: {
        title: "Multi-language sites",
        description:
          "Translate any page with a sibling file. Bundled UI strings for 7 languages, a language picker and hreflang tags.",
      },
      mobile: {
        title: "Perfect on mobile",
        description:
          "Bottom-sheet navigation, page contents a tap away, and no sideways scroll on any phone.",
      },
      sections: {
        title: "Docs, blog & changelog",
        description:
          "Multiple content sections with tags, dates, and auto-generated index pages, all from configuration.",
      },
      search: {
        title: "Search & navigation",
        description:
          "Orama full-text search, per-section sidebars, keyboard shortcuts, and smart table-of-contents.",
      },
      theme: {
        title: "Dark mode & theme tokens",
        description:
          "Built-in dark mode, light/dark image variants, CSS variables like --primary, and swappable Shiki themes.",
      },
      preview: {
        title: "Instant preview, static output",
        description:
          "Edits show up in the browser as you save, no reload. Then a static build with sitemap, robots and RSS.",
      },
    },
  },
  showcase: {
    title: "Write Markdown. Ship a website.",
    description: rich(
      "Your ",
      { code: ".md" },
      " files stay as they are — Livemark does the rest.",
    ),
    renderedLabel: "rendered",
  },
  agents: {
    title: "Ready for AI agents",
    description:
      "Every build publishes your site in the formats AI agents look for, alongside the HTML for people. No configuration needed.",
    terminalLabel: "terminal",
    more: { link: "customization/ai-agents", text: "How Livemark serves AI agents →" },
    points: {
      twin: {
        title: "A Markdown twin of every page",
        description: rich(
          "Each page gets an ",
          { code: "index.md" },
          " beside its HTML, linked from the page head. One CDN rule serves it to requests that send ",
          { code: "Accept: text/markdown" },
          ".",
        ),
      },
      llms: {
        title: "llms.txt out of the box",
        description: rich(
          "An ",
          { code: "llms.txt" },
          " index of every twin, grouped by section and advertised in a ",
          { code: "Link" },
          " header on the home page.",
        ),
      },
      signals: {
        title: "Content signals",
        description: rich(
          { code: "robots.txt" },
          " states whether your pages may be used for search, AI answers or model training. One config option changes it.",
        ),
      },
      skills: {
        title: "Agent skills",
        description: rich(
          "Point ",
          { code: "skills" },
          " at your ",
          { code: "SKILL.md" },
          " files and they are published under ",
          { code: "/.well-known/agent-skills/" },
          ".",
        ),
      },
      coding: {
        title: "Skills for your coding agent",
        description: rich(
          { code: "npx skills add https://livemark.dev" },
          " teaches Claude Code, Cursor or Codex to ",
          { link: "agent-skills", text: "write, configure and customize" },
          " your Livemark site.",
        ),
      },
    },
  },
  finalCta: {
    titleLead: "Start writing.",
    titleHighlight: "Let Livemark handle the rest.",
    description:
      "Point Livemark at the Markdown you already have, add pages when you need them, deploy. That's the whole setup.",
    readDocs: "Read the docs",
    whatsNew: "See what's new",
  },
  datist: {
    builtBy: "Built by",
    tagline: "Datist — Software development, end to end.",
  },
}

/** Every user-visible string on the landing page, in one language. */
export type LandingCopy = typeof en

const es: LandingCopy = {
  hero: {
    eyebrow: "Para TypeScript",
    titleLines: ["Sitios Markdown", "preciosos,"],
    titleHighlight: "a tu manera.",
    description:
      "Deja tus archivos donde están, añade páginas de TanStack Start, cambia el estilo de todo con Tailwind y obtén documentación, un blog y un changelog que lucen bien en cualquier pantalla.",
    getStarted: "Empezar",
    viewSource: "Ver código",
    sourceLabel: "Escrito en Markdown puro",
  },
  slides: {
    docs: {
      title: "Documentación",
      alts: [
        "Una página de documentación de Livemark con barra lateral, un bloque de código resaltado y una tabla de contenidos",
      ],
    },
    blog: {
      title: "Blog",
      alts: [
        "El índice del blog de Livemark con publicaciones, fechas, autores y etiquetas",
      ],
    },
    changelog: {
      title: "Changelog",
      alts: ["Un changelog de Livemark con las versiones y sus fechas"],
    },
    mobile: {
      title: "Móvil",
      alts: [
        "La barra lateral de Livemark abierta en un teléfono, con el selector de sección y los artículos",
        "Una página de documentación de Livemark en un teléfono, con avisos de nota, consejo, advertencia y peligro",
        "El contenido de la página abierto como hoja inferior en un teléfono",
      ],
    },
  },
  freedom: {
    title: "No se interpone en tu camino",
    description:
      "Sin estructura de carpetas obligatoria, sin ataduras. Livemark se adapta a tu repo, no al revés.",
    repoLabel: "tu-repo",
    points: {
      layout: {
        title: "Cualquier estructura de archivos",
        description: rich(
          "Apunta los globs de ",
          { code: "include" },
          " al Markdown que ya tienes. README, CONTRIBUTING y CHANGELOG también se convierten en páginas.",
        ),
      },
      pages: {
        title: "Páginas reales de TanStack Start",
        description: rich(
          "Coloca un archivo ",
          { code: ".tsx" },
          " en ",
          { code: ".livemark/routes/" },
          " para precios, paneles o lo que quieras. Esta página de inicio es una de ellas.",
        ),
      },
      tailwind: {
        title: "Tailwind, totalmente personalizable",
        description: rich(
          "Construido sobre Tailwind v4 y primitivas al estilo shadcn. Cambia el estilo con tokens CSS, usa utilidades en tus propias páginas o ",
          {
            link: "customization/overriding-escaping",
            text: "sobrescribe cualquier componente",
          },
          " en ",
          { code: ".livemark/" },
          ".",
        ),
      },
    },
  },
  features: {
    title: "Bonito por defecto",
    description:
      "Markdown enriquecido, una experiencia móvil cuidada y valores por defecto sensatos. Personaliza solo lo que quieras.",
    items: {
      shiki: {
        title: "Resaltado de sintaxis con Shiki",
        description:
          "Más de 100 lenguajes, temas Catppuccin, diffs, líneas resaltadas y pistas de tipos con TwoSlash, listos para usar.",
      },
      diagrams: {
        title: "Diagramas y matemáticas",
        description:
          "Diagramas de flujo con Mermaid y ecuaciones con KaTeX, adaptados al tema y sin configuración. Solo escríbelos en tu Markdown.",
      },
      syntax: {
        title: "Sintaxis Markdown enriquecida",
        description:
          "Avisos, pestañas, pasos, tarjetas, árboles de archivos e insignias como directivas simples, y componentes MDX cuando necesites más.",
      },
      translations: {
        title: "Sitios multilingües",
        description:
          "Traduce cualquier página con un archivo hermano. Textos de interfaz para 7 idiomas, selector de idioma y etiquetas hreflang.",
      },
      mobile: {
        title: "Perfecto en móvil",
        description:
          "Navegación en hoja inferior, el contenido de la página a un toque y sin desplazamiento lateral en ningún teléfono.",
      },
      sections: {
        title: "Documentación, blog y changelog",
        description:
          "Varias secciones de contenido con etiquetas, fechas e índices generados automáticamente, todo desde la configuración.",
      },
      search: {
        title: "Búsqueda y navegación",
        description:
          "Búsqueda de texto completo con Orama, barras laterales por sección, atajos de teclado y una tabla de contenidos inteligente.",
      },
      theme: {
        title: "Modo oscuro y tokens de tema",
        description:
          "Modo oscuro integrado, variantes de imagen clara y oscura, variables CSS como --primary y temas de Shiki intercambiables.",
      },
      preview: {
        title: "Vista previa al instante, salida estática",
        description:
          "Los cambios aparecen en el navegador al guardar, sin recargar. Después, un build estático con sitemap, robots y RSS.",
      },
    },
  },
  showcase: {
    title: "Escribe Markdown. Publica un sitio web.",
    description: rich(
      "Tus archivos ",
      { code: ".md" },
      " se quedan como están: Livemark hace el resto.",
    ),
    renderedLabel: "renderizado",
  },
  agents: {
    title: "Listo para agentes de IA",
    description:
      "Cada build publica tu sitio en los formatos que buscan los agentes de IA, junto al HTML para las personas. Sin configuración.",
    terminalLabel: "terminal",
    more: {
      link: "customization/ai-agents",
      text: "Cómo sirve Livemark a los agentes de IA →",
    },
    points: {
      twin: {
        title: "Un gemelo en Markdown de cada página",
        description: rich(
          "Cada página tiene un ",
          { code: "index.md" },
          " junto a su HTML, enlazado desde el head de la página. Una regla de CDN lo sirve a las peticiones que envían ",
          { code: "Accept: text/markdown" },
          ".",
        ),
      },
      llms: {
        title: "llms.txt listo para usar",
        description: rich(
          "Un índice ",
          { code: "llms.txt" },
          " de todos los gemelos, agrupado por sección y anunciado en una cabecera ",
          { code: "Link" },
          " de la página de inicio.",
        ),
      },
      signals: {
        title: "Señales de contenido",
        description: rich(
          { code: "robots.txt" },
          " indica si tus páginas pueden usarse para búsqueda, respuestas de IA o entrenamiento de modelos. Una opción de configuración lo cambia.",
        ),
      },
      skills: {
        title: "Skills para agentes",
        description: rich(
          "Apunta ",
          { code: "skills" },
          " a tus archivos ",
          { code: "SKILL.md" },
          " y se publican en ",
          { code: "/.well-known/agent-skills/" },
          ".",
        ),
      },
      coding: {
        title: "Skills para tu agente de código",
        description: rich(
          { code: "npx skills add https://livemark.dev" },
          " enseña a Claude Code, Cursor o Codex a ",
          { link: "agent-skills", text: "escribir, configurar y personalizar" },
          " tu sitio Livemark.",
        ),
      },
    },
  },
  finalCta: {
    titleLead: "Empieza a escribir.",
    titleHighlight: "Deja que Livemark se encargue del resto.",
    description:
      "Apunta Livemark al Markdown que ya tienes, añade páginas cuando las necesites y despliega. Esa es toda la configuración.",
    readDocs: "Leer la documentación",
    whatsNew: "Ver novedades",
  },
  datist: {
    builtBy: "Creado por",
    tagline: "Datist — Desarrollo de software, de principio a fin.",
  },
}

/** The landing copy per language code; unknown codes fall back to `en`. */
export const landingCopy: Partial<Record<string, LandingCopy>> & { en: LandingCopy } = {
  en,
  es,
}
