import { z } from "zod"
import type { ConfigEnv, UserConfig as ViteUserConfig } from "vite"
import { Language, Localized } from "./language.ts"
import { Link, UserLink } from "./link.ts"
import { Patch } from "./patch.ts"
import { Section, UserSection } from "./section.ts"
import { CodeThemeDark, CodeThemeLight } from "./theme.ts"

/** Escape hatch for arbitrary Vite config — accepts either a config
 *  object (simple overrides) or a function form (`(env) => config`,
 *  matching Vite's own `defineConfig`). Merged on top of livemark's
 *  defaults via `mergeConfig`, so plugin arrays concatenate, defines
 *  merge, etc. Use this for deployment-target tweaks (e.g. CF Workers
 *  via `environments.ssr.resolve.conditions: ["workerd", ...]`). */
export type ViteOverride =
  | ViteUserConfig
  | ((env: ConfigEnv) => ViteUserConfig | Promise<ViteUserConfig>)

/** Sub-path mount. String form is used as-is; function form is called
 *  with Vite's `command` (`"serve"` in dev, `"build"` in production) so
 *  the user can branch (typical case: serve at `/` in dev but at
 *  `/repo/` in production for GitHub Pages). The build pipeline
 *  resolves it to a string before any runtime sees it. */
export type Base = string | ((command: "build" | "serve") => string | undefined)

/** Extra site-wide `<head>` tags, appended after Livemark's defaults. A meta tag
 *  sharing a default's `name` or `property` replaces it. */
export type Head = z.infer<typeof Head>
export const Head = z.object({
  meta: z.array(z.record(z.string(), z.string())).optional(),
  links: z.array(z.record(z.string(), z.string())).optional(),
  scripts: z.array(z.record(z.string(), z.string())).optional(),
})

/** How automated systems may use the site's content, published as a
 *  `Content-Signal` line in the generated `robots.txt`. */
export type ContentSignals = z.infer<typeof ContentSignals>
export const ContentSignals = z.object({
  search: z.boolean().default(true),
  aiInput: z.boolean().default(true),
  aiTrain: z.boolean().default(true),
})

/**
 * User-provided configuration for Livemark.
 *
 * `vite` and `base` are lifted from `unknown` to their public types so
 * `defineConfig` shows the right shape in editors. Use this type for
 * the input to `defineConfig` — it keeps defaulted fields optional
 * (because zod input ≠ output for fields with `.default()`).
 */
export type UserConfig = Omit<z.input<typeof UserConfig>, "vite" | "base"> & {
  vite?: ViteOverride
  base?: Base
}
export const UserConfig = z.object({
  site: z.string().optional(),
  // Stored as `unknown` in the schema (zod can't type a function and
  // string union meaningfully); the public TypeScript surface above
  // lifts it back to `Base` for editor support. The build pipeline
  // resolves it via `resolveBase()` before any runtime consumer sees
  // it, so the runtime `WebsiteConfig.base` is strictly `string`.
  base: z.unknown().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  title: Localized.default("Livemark"),
  description: Localized.default("Markdown site generator"),
  banner: Localized.optional(),
  breadcrumbs: z.boolean().optional(),
  include: z.union([z.string(), z.array(z.string())]).default("**/*.md"),
  exclude: z.union([z.string(), z.array(z.string())]).optional(),
  codeThemeLight: CodeThemeLight.default("catppuccin-latte"),
  codeThemeDark: CodeThemeDark.default("catppuccin-mocha"),
  links: z.array(UserLink).optional(),
  sections: z.array(UserSection).optional(),
  languages: z
    .array(Language)
    .min(1)
    .refine(languages => new Set(languages.map(l => l.code)).size === languages.length, {
      message: "language codes must be unique",
    })
    .optional(),
  patches: z.array(Patch).optional(),
  head: Head.optional(),
  contentSignals: ContentSignals.prefault({}),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  // Stored as `unknown` in the schema (zod can't type a Vite UserConfig
  // or a function returning one meaningfully); the public TypeScript
  // surface above lifts it back to ViteOverride for editor support.
  vite: z.unknown().optional(),
})

/** Website configuration injected at build time via Vite define, its texts resolved
 *  to one language. `base` is strictly a string here — the build pipeline has
 *  already resolved any function form via `resolveBase()`. */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = UserConfig.pick({
  site: true,
  favicon: true,
  logo: true,
  head: true,
  breadcrumbs: true,
}).extend({
  title: z.string(),
  description: z.string(),
  banner: z.string().optional(),
  links: z.array(Link).optional(),
  sections: z.array(Section).optional(),
  base: z.string().optional(),
})

/**
 * System-computed configuration derived from the config file location.
 */
export type SystemConfig = z.infer<typeof SystemConfig>
export const SystemConfig = z.object({
  root: z.string(),
  configPath: z.string(),
  configDependencies: z.array(z.string()).default([]),
})

/**
 * Fully resolved Livemark configuration.
 *
 * `vite` stays `unknown` because that's what the runtime schema
 * produces — consumer-facing typing happens via {@link UserConfig} so
 * `defineConfig` shows the right shape in editors. `base` is lifted to
 * `string | undefined` because `loadConfig()` resolves any function
 * form via `resolveBase()` before returning.
 */
export type Config = Omit<z.infer<typeof Config>, "base"> & {
  base?: string
}
export const Config = UserConfig.merge(SystemConfig)
