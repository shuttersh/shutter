#!/usr/bin/env node

import meow from 'meow'
import * as commands from './commands'
import { showCommandHelp, Command } from './command'

const cli = meow(`
  Usage
    $ shutter <command> [<arguments>]

  Commands
    push              Upload page for rendering.
    pull              Download rendered snapshot or diff.

  Options
    --help            Show this help.
    --version         Show the version.

  Environment
    SHUTTER_API       Shutter service endpoint to use. For development purposes.
                      Something like: https://api.shutter.sh/
`, { autoHelp: false })

const commandName = cli.input[0]
const command = commandName ? (commands as { [commandName: string]: Command })[commandName] : null
const args = cli.input.slice(1)

const fail = (message: string) => {
  console.error(message)
  process.exit(1)
}

if (cli.input.length === 0 || (cli.flags.help && !command)) {
  cli.showHelp()
  process.exit(0)
} else if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
} else if (command && cli.flags.help) {
  showCommandHelp(command)
  process.exit(0)
} else if (!command) {
  fail(`Unknown command: ${commandName}`)
} else if (command.minimumArgs && args.length < command.minimumArgs) {
  showCommandHelp(command)
  process.exit(1)
}

(command as Command).command(args, cli.flags)
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
