import { Command } from "commander"
import { build } from "./commands/build.ts"
import { serve } from "./commands/serve.ts"
import { helpConfiguration } from "./helpers/program.ts"

export const program = new Command()
  .name("livemark")
  .description("Livemark static site generator")
  .configureHelp(helpConfiguration)
  .addCommand(serve)
  .addCommand(build)
