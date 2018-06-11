import * as fs from 'mz/fs'
import * as path from 'path'
import { getUserConfigPath, loadShutterConfig, updateShutterConfig } from '@shutter/shutterrc'
import { CommandFunction } from '../command'

const JWT_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/

const isFile = async (filePath: string) => {
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

export const minimumArgs = 1

export const help = `
  Usage
    $ shutter authenticate <AUTHTOKEN>

  Options
    --local             Create .shutterrc in current directory. Default: In user home directory.
    --help              Show this help.
`

export type Flags = {
  local?: boolean
}

export const command: CommandFunction = async (args: string[], flags: Flags) => {
  if (args.length > 1) throw new Error(`Expected one argument, got ${args.length}. Try 'npx shutter authenticate --help'.`)

  const authToken = args[0]
  const configFilePath = flags.local ? './.shutterrc' : getUserConfigPath()

  if (!authToken.match(JWT_REGEX)) throw new Error(`Invalid authentication token. Token is supposed to be a valid JSON web token.`)

  const previousConfig = await isFile(configFilePath)
    ? await loadShutterConfig(path.dirname(configFilePath))
    : {}

  await updateShutterConfig(configFilePath, { ...previousConfig, authtoken: authToken })
  console.log(`Updated shutter config file: ${path.resolve(configFilePath)}`)
}
