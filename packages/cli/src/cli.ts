#!/usr/bin/env node

import meow from 'meow'
import uploadTestcase from './upload-command'

const cli = meow(`
  Usage
    $ shutter [<options>] <files...>

  Arguments
    Pass the path to an HTML file and optionally additional asset files (CSS/JS).

  Options
    --await-completion  Run until the snapshot has been processed. Optional.
    --help              Show this help.
    --version           Show version.

  Environment
    SHUTTER_HOST        Shutter service endpoint to use. For development purposes.
                        Something like: https://api.shutter.sh/
`)

if (cli.flags.help || cli.input.length === 0) {
  cli.showHelp()
  process.exit(0)
} else if (cli.flags.version) {
  cli.showVersion()
  process.exit(0)
}

const fail = (message: string) => {
  console.error(message)
  process.exit(1)
}

// TODO: Need to set a default, once the service has a production deployment
const shutterHost = (process.env.SHUTTER_HOST || fail(`SHUTTER_HOST environment variable not set.`)) as string

const commandOptions = {
  shutterHost,
  waitUntilFinished: cli.flags.awaitCompletion
}

uploadTestcase(cli.input, commandOptions)
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
