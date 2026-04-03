import { cloudflare } from "@cloudflare/vite-plugin"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, configDefaults, coverageConfigDefaults } from "vite-plus"
import svgr from "vite-plugin-svgr"

const ignorePatterns = ["**/generated/**", "**.gen.**"]

export default defineConfig({
  fmt: {
    semi: false,
    printWidth: 80,
    arrowParens: "avoid",
    ignorePatterns,
  },
  lint: {
    ignorePatterns,
    options: {
      typeAware: false,
      typeCheck: false,
    },
  },
  build: { outDir: "build" },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtools(),
    tailwind(),
    tanstackStart({
      srcDirectory: ".",
      prerender: { enabled: true, crawlLinks: true },
    }),
    react(),
    svgr(),
  ],
  test: {
    include: ["**/*.unit.(ts|tsx)"],
    exclude: [...configDefaults.exclude, "**/build/**"],
    env: { NODE_OPTIONS: "--no-warnings" },
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    silent: "passed-only",
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/@*",
        "**/*.gen.ts",
        "**/build/**",
        "**/coverage/**",
      ],
    },
  },
})
