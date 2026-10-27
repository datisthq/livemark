/** A piece of landing text: plain, inline code, or a link to a site page by its path. */
export type RichSegment = string | { code: string } | { link: string; text: string }

const rich = (...segments: RichSegment[]) => segments

const en = {
  hero: {
    eyebrow: "Open source · MIT License",
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
    eyebrow: "Código abierto · Licencia MIT",
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

const zh: LandingCopy = {
  hero: {
    eyebrow: "开源 · MIT 许可证",
    titleLines: ["精美的", "Markdown 站点，"],
    titleHighlight: "随心而建。",
    description:
      "文件原地不动，按需添加 TanStack Start 页面，用 Tailwind 重新定制一切，即可获得在任何屏幕上都出色的文档、博客和更新日志。",
    getStarted: "快速开始",
    viewSource: "查看源码",
    sourceLabel: "用纯 Markdown 编写",
  },
  slides: {
    docs: {
      title: "文档",
      alts: ["一个 Livemark 文档页面，带有侧边栏、高亮的代码块和目录"],
    },
    blog: {
      title: "博客",
      alts: ["一个 Livemark 博客索引页，列出带有日期、作者和标签的文章"],
    },
    changelog: {
      title: "更新日志",
      alts: ["一个 Livemark 更新日志，列出各个版本及其发布日期"],
    },
    mobile: {
      title: "移动端",
      alts: [
        "在手机上打开的 Livemark 侧边栏，带有栏目选择器和文章列表",
        "手机上的一个 Livemark 文档页面，展示注意、提示、警告和危险提示框",
        "在手机上以底部弹出面板打开的页面目录",
      ],
    },
  },
  freedom: {
    title: "不碍你的事",
    description: "不强制目录结构，不绑定平台。Livemark 适应你的仓库，而不是反过来。",
    repoLabel: "your-repo",
    points: {
      layout: {
        title: "任意文件布局",
        description: rich(
          "把 ",
          { code: "include" },
          " glob 指向你现有的 Markdown。README、CONTRIBUTING 和 CHANGELOG 也会变成页面。",
        ),
      },
      pages: {
        title: "真正的 TanStack Start 页面",
        description: rich(
          "把一个 ",
          { code: ".tsx" },
          " 文件放进 ",
          { code: ".livemark/routes/" },
          "，即可制作定价页、仪表盘或其他任何页面。这个首页就是其中之一。",
        ),
      },
      tailwind: {
        title: "Tailwind，完全可定制",
        description: rich(
          "基于 Tailwind v4 和 shadcn 风格的基础元素构建。用 CSS 变量重新定制样式，在自己的页面中使用工具类，或在 ",
          { code: ".livemark/" },
          " 下",
          { link: "customization/overriding-escaping", text: "覆盖任意组件" },
          "。",
        ),
      },
    },
  },
  features: {
    title: "开箱即美",
    description:
      "丰富的 Markdown、精致的移动端体验和合理的默认设置。只定制你想改的部分。",
    items: {
      shiki: {
        title: "Shiki 语法高亮",
        description:
          "开箱即支持 100 多种语言、Catppuccin 主题、diff、行高亮以及 TwoSlash 类型提示。",
      },
      diagrams: {
        title: "图表与公式",
        description:
          "Mermaid 流程图和 KaTeX 公式，自动适配主题，无需配置。直接写在 Markdown 里即可。",
      },
      syntax: {
        title: "丰富的 Markdown 语法",
        description:
          "提示框、标签页、步骤、卡片、文件树和徽章都是简单的指令——需要更多时还可以使用 MDX 组件。",
      },
      translations: {
        title: "多语言站点",
        description:
          "用一个同名的兄弟文件翻译任意页面。内置 7 种语言的界面文本、语言选择器和 hreflang 标签。",
      },
      mobile: {
        title: "移动端完美呈现",
        description: "底部弹出式导航，页面目录一触即达，任何手机上都不会横向滚动。",
      },
      sections: {
        title: "文档、博客和更新日志",
        description: "多个内容栏目，支持标签、日期和自动生成的索引页，全部通过配置完成。",
      },
      search: {
        title: "搜索与导航",
        description: "Orama 全文搜索、按栏目划分的侧边栏、键盘快捷键和智能目录。",
      },
      theme: {
        title: "深色模式与主题变量",
        description:
          "内置深色模式、浅色/深色图片变体、--primary 等 CSS 变量，以及可替换的 Shiki 主题。",
      },
      preview: {
        title: "即时预览，静态输出",
        description:
          "保存即在浏览器中呈现修改，无需刷新。随后生成带有 sitemap、robots 和 RSS 的静态构建。",
      },
    },
  },
  showcase: {
    title: "写 Markdown，发布网站。",
    description: rich("你的 ", { code: ".md" }, " 文件保持原样——其余的交给 Livemark。"),
    renderedLabel: "渲染结果",
  },
  agents: {
    title: "为 AI 智能体做好准备",
    description:
      "每次构建都会在面向人的 HTML 之外，以 AI 智能体所需的格式发布你的站点。无需任何配置。",
    terminalLabel: "终端",
    more: { link: "customization/ai-agents", text: "Livemark 如何服务 AI 智能体 →" },
    points: {
      twin: {
        title: "每个页面都有 Markdown 副本",
        description: rich(
          "每个页面的 HTML 旁都有一个 ",
          { code: "index.md" },
          "，并在页面 head 中链接。一条 CDN 规则即可把它提供给发送 ",
          { code: "Accept: text/markdown" },
          " 的请求。",
        ),
      },
      llms: {
        title: "开箱即用的 llms.txt",
        description: rich(
          "一个按栏目分组、列出所有副本的 ",
          { code: "llms.txt" },
          " 索引，并通过首页的 ",
          { code: "Link" },
          " 响应头公布。",
        ),
      },
      signals: {
        title: "内容信号",
        description: rich(
          { code: "robots.txt" },
          " 声明你的页面能否用于搜索、AI 回答或模型训练。改一个配置项即可调整。",
        ),
      },
      skills: {
        title: "智能体技能",
        description: rich(
          "把 ",
          { code: "skills" },
          " 指向你的 ",
          { code: "SKILL.md" },
          " 文件，它们就会发布在 ",
          { code: "/.well-known/agent-skills/" },
          " 下。",
        ),
      },
      coding: {
        title: "为你的编程智能体准备的技能",
        description: rich(
          { code: "npx skills add https://livemark.dev" },
          " 让 Claude Code、Cursor 或 Codex 学会",
          { link: "agent-skills", text: "编写、配置和定制" },
          "你的 Livemark 站点。",
        ),
      },
    },
  },
  finalCta: {
    titleLead: "开始写作。",
    titleHighlight: "其余的交给 Livemark。",
    description:
      "把 Livemark 指向你现有的 Markdown，需要时添加页面，然后部署。这就是全部的设置。",
    readDocs: "阅读文档",
    whatsNew: "查看更新",
  },
  datist: {
    builtBy: "出品方",
    tagline: "Datist——端到端的软件开发。",
  },
}

/** The landing copy per language code; unknown codes fall back to `en`. */
export const landingCopy: Partial<Record<string, LandingCopy>> & { en: LandingCopy } = {
  en,
  es,
  zh,
}
