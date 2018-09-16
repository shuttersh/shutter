import EventSource from 'eventsource'
import * as logSymbols from 'log-symbols'
import * as fs from 'mz/fs'
import nanoid from 'nanoid'
import * as path from 'path'
import open from 'opn'
import ora from 'ora'
import request from 'superagent'
import joinURL from 'url-join'
import { shutterrc } from '@shutter/core'
import { CommandFunction } from '../command'

interface UserProfile {
  login: string
  // (incomplete)
}

const getLoginURL = () => process.env.SHUTTER_LOGIN || 'https://login.shutter.sh/'

async function isFile (filePath: string) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

async function queryMyUserData (authToken: string): Promise<UserProfile> {
  const profile = await request.get(joinURL(getLoginURL(), '/me'))
    .set('Authorization', 'Bearer ' + authToken)
  return profile.body
}

function printLoggedIn (userProfile: UserProfile) {
  console.log(`${logSymbols.success} Logged in as ${userProfile.login}`)
}

export const help = `
  Usage
    $ shutter login [--status]

  Options
    --local             Create .shutterrc in current directory. Default: In user home directory.
    --status            Show the login status, don't attempt to log in.
    --help              Show this help.
`

async function checkLoginStatus () {
  const userConfig = await shutterrc.loadShutterConfig(path.dirname(shutterrc.getUserConfigPath()))
  const projectConfig = await shutterrc.loadShutterConfig('./')
  const config = { ...userConfig, ...projectConfig }

  if (config.authtoken) {
    const profile = await queryMyUserData(config.authtoken)
    printLoggedIn(profile)
  } else {
    console.log(`${logSymbols.error} Logged out`)
    process.exit(10)
  }
}

async function login (configFilePath: string) {
  const previousConfig = await isFile(configFilePath)
    ? await shutterrc.loadShutterConfig(path.dirname(configFilePath))
    : {}

  const streamID = nanoid(24)
  const eventSource = new EventSource(joinURL(getLoginURL(), `/stream/${streamID}`))

  const spinner = ora('Waiting for login in browser').start()

  return new Promise<string>((resolve, reject) => {
    eventSource.addEventListener('auth-token', (event: any) => {
      spinner.stop()
      eventSource.close()

      const authToken = event.data
      shutterrc.updateShutterConfig(configFilePath, { ...previousConfig, authtoken: authToken })
        .then(() => resolve(authToken))
        .catch(error => reject(error))
    })

    open(`${getLoginURL()}?streamID=${streamID}`).catch(reject)
  })
}

export type Flags = {
  local?: boolean,
  status?: boolean
}

export const command: CommandFunction = async (args: string[], flags: Flags) => {
  if (args.length > 0) throw new Error('Passed unrecognized arguments.')

  if (flags.status) {
    await checkLoginStatus()
  } else {
    const configFilePath = flags.local ? './.shutterrc' : shutterrc.getUserConfigPath()
    const authToken = await login(configFilePath)
    const profile = await queryMyUserData(authToken)

    printLoggedIn(profile)

    if (flags.local) {
      console.log(`Security note: Don't forget to add .shutterrc file to your .gitignore.`)
    }
    process.exit(0)
  }
}
