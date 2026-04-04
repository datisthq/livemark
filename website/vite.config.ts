import contentCollections from "@content-collections/vite"
import tailwind from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  build: { outDir: "build" },
  plugins: [
    devtools(),
    tailwind(),
    contentCollections(),
    tanstackStart({
      srcDirectory: ".",
      prerender: { enabled: true, crawlLinks: true },
    }),
    react(),
    svgr(),
  ],
})
