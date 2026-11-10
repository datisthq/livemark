import { f } from "fireargs"
import { build } from "./commands/build.ts"
import { clear } from "./commands/clear.ts"
import { escape } from "./commands/escape.ts"
import { preview } from "./commands/preview.ts"
import { start } from "./commands/start.ts"
import { helpConfiguration, renderError } from "./helpers/program.ts"
import packageJson from "../package.json" with { type: "json" }

export const program = f
  .program({
    name: "livemark",
    description: "Livemark static site generator",
    version: packageJson.version,
    versionOption: {
      flags: "-v, --version",
      description: "display the livemark version",
    },
    configureHelp: helpConfiguration,
    renderError,
  })
  .router({ start, build, preview, escape, clear })
