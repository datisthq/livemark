import { Command } from "commander"
import { build } from "./commands/build.ts"
import { serve } from "./commands/serve.ts"

export const program = new Command()
  .name("livemark")
  .description("Livemark static site generator")
  .addCommand(serve)
  .addCommand(build)
