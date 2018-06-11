#!/usr/bin/env node

import meow from 'meow'
import { loadShutterConfig } from '@shutter/shutterrc'
import * as commands from './commands'
import { showCommandHelp, Command } from './command'

const cli = meow(`
  Usage
    $ shutter <command> [<arguments>]

  Commands
    update            Selectively update local snapshots.

  Low-level commands
    pull              Download rendered snapshot or diff.
    snapshot          Upload page for rendering.

  Options
    --help            Show this help.
    --version         Show the version.
`, {
  autoHelp: false,
  description: false,
  flags: {
    awaitCompletion: {
      type: 'boolean'
    }
  }
})

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

loadShutterConfig()
  .then(config => {
    // Allow using a different API by setting `servicehost` in .shutterrc (for development purposes)
    if (config.serviceHost && !process.env.SHUTTER_API) {
      // Cannot use `process.env.SHUTTER_API = process.env.SHUTTER_API || config.serviceHost || undefined`
      // since `undefined` would be casted to string...
      process.env.SHUTTER_API = config.serviceHost
    }
  })
  .then(() => (command as Command).command(args, cli.flags))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
