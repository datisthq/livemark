import { Command } from "commander"
import { build } from "./commands/build.ts"
import { escape } from "./commands/escape.ts"
import { preview } from "./commands/preview.ts"
import { start } from "./commands/start.ts"
import { helpConfiguration } from "./helpers/program.ts"

export const program = new Command()
  .name("livemark")
  .description("Livemark static site generator")
  .option("-c, --config <path>", "path to config file")
  .configureHelp(helpConfiguration)
  .addCommand(start)
  .addCommand(build)
  .addCommand(preview)
  .addCommand(escape)
