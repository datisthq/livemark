#!/usr/bin/env node

process.removeAllListeners("warning")
process.on("warning", warning => {
  if (warning.name === "ExperimentalWarning") {
    return
  }
  console.warn(warning)
})

const { program } = await import("../program.ts")
program.parse()
