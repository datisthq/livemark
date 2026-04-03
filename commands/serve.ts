import { Command } from "commander"

/**
 * Start a development server.
 */
export const serve = new Command("serve")
  .description("Start a development server")
  .action(() => {})
