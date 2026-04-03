import { Command } from "commander"

/**
 * Build the site for production.
 */
export const build = new Command("build")
  .description("Build the site for production")
  .action(() => {})
