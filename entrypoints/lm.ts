#!/usr/bin/env node

process.removeAllListeners("warning")
process.on("warning", warning => {
  if (warning.name === "ExperimentalWarning") {
    return
  }
  console.warn(warning)
})

const { serve } = await import("../commands/serve.ts")
serve.parse(process.argv)
