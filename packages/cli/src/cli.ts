#!/usr/bin/env node

import meow from 'meow'
import uploadTestcase from './upload-command'

const cli = meow(`
  Usage
    $ shutter --testrun=<testRunID> --name=<testcase name> <files...>

  Arguments
    Pass a file path to an HTML file and optionally additional asset files (CSS/JS).

  Options
    --name          The name of this test case.
    --testrun       The shutter.sh test run ID.
    --help          Show this help.
    --version       Show version.

  Environment
    SHUTTER_HOST    Shutter service endpoint to use. For development purposes.
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

uploadTestcase(cli.input, { shutterHost, testRunID: cli.flags.testrun, name: cli.flags.name })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
