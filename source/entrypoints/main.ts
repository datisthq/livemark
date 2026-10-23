#!/usr/bin/env node
import { enableCompileCache } from "node:module"

enableCompileCache()

process.removeAllListeners("warning")
process.on("warning", warning => {
  if (warning.name === "ExperimentalWarning") {
    return
  }
  console.warn(warning)
})

const { program } = await import("../program.ts")
program.parse()
