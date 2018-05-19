import * as fs from 'mz/fs'
import * as ini from 'ini'
import * as path from 'path'
import * as os from 'os'

export interface ShutterConfig {
  authtoken: string,
  [key: string]: string
}

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

const getPotentialFilePaths = (directoryPath: string) => {
  const potentialFilePaths: string[] = []

  do {
    potentialFilePaths.push(path.join(directoryPath, '.shutterrc'))
    directoryPath = path.resolve(directoryPath, '..')
  } while (directoryPath !== path.parse(directoryPath).root)

  const userConfigPath = path.join(os.homedir(), '.shutterrc')
  if (!potentialFilePaths.find(path => path === userConfigPath)) {
    potentialFilePaths.push(userConfigPath)
  }

  return potentialFilePaths
}

const locateNearestConfigFile = async (directoryPath: string) => {
  const potentialFilePaths = getPotentialFilePaths(path.normalize(directoryPath))

  for (const filePath of potentialFilePaths) {
    if (await isFile(filePath)) return filePath
  }

  throw new Error(`Cannot locate .shutterrc file.`)
}

export const loadShutterConfig = async (directoryPath: string = process.cwd()): Promise<ShutterConfig> => {
  const configFilePath = await locateNearestConfigFile(directoryPath)
  const config = ini.parse(await fs.readFile(configFilePath, 'utf8'))

  if (!config.authtoken) throw new Error(`Missing mandatory property: 'authtoken' in ${configFilePath}`)

  return config
}
