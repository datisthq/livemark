import { z } from "zod"
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
  headerLinks: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
  sidebarLinks: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
})

/** Website configuration injected at build time via Vite define */
export type WebsiteConfig = z.infer<typeof WebsiteConfig>
export const WebsiteConfig = UserConfig.pick({
  title: true,
  description: true,
  site: true,
  favicon: true,
  logo: true,
  headerLinks: true,
  sidebarLinks: true,
})

/**
 * System-computed configuration derived from the config file location.
 */
export type SystemConfig = z.infer<typeof SystemConfig>
export const SystemConfig = z.object({
  root: z.string(),
})

/**
 * Fully resolved Livemark configuration.
 */
export type Config = z.infer<typeof Config>
export const Config = UserConfig.merge(SystemConfig)
