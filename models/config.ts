import { z } from "zod"
import { Link } from "./link.ts"
import { Section } from "./section.ts"
import { CodeThemeDark, CodeThemeLight } from "./theme.ts"

/**
 * User-provided configuration for Livemark.
 */
export type UserConfig = z.infer<typeof UserConfig>
export const UserConfig = z.object({
  site: z.string().optional(),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  title: z.string().default("Livemark"),
  description: z.string().default("Markdown site generator"),
  include: z.union([z.string(), z.array(z.string())]),
  exclude: z.union([z.string(), z.array(z.string())]).optional(),
  codeThemeLight: CodeThemeLight.default("catppuccin-latte"),
  codeThemeDark: CodeThemeDark.default("catppuccin-mocha"),
  links: z.array(Link).optional(),
  sections: z.array(Section).optional(),
})

/** Website configuration injected at build time via Vite define */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = UserConfig.pick({
  title: true,
  description: true,
  site: true,
  favicon: true,
  logo: true,
  links: true,
  sections: true,
})

/**
 * System-computed configuration derived from the config file location.
 */
export type SystemConfig = z.infer<typeof SystemConfig>
export const SystemConfig = z.object({
  root: z.string(),
  configPath: z.string(),
})

/**
 * Fully resolved Livemark configuration.
 */
export type Config = z.infer<typeof Config>
export const Config = UserConfig.merge(SystemConfig)
