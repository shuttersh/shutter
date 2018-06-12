import * as fs from 'mz/fs'
import * as ini from 'ini'
import * as path from 'path'
import * as os from 'os'

export interface ShutterConfig {
  authtoken: string,
  [key: string]: string | undefined
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

export const getUserConfigPath = () => {
  return path.join(os.homedir(), '.shutterrc')
}

const getPotentialFilePaths = (directoryPath: string) => {
  const potentialFilePaths: string[] = []

  do {
    potentialFilePaths.push(path.join(directoryPath, '.shutterrc'))
    directoryPath = path.resolve(directoryPath, '..')
  } while (directoryPath !== path.parse(directoryPath).root)

  const userConfigPath = getUserConfigPath()

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

export const updateShutterConfig = async (configFilePath: string, updatedConfig: ShutterConfig) => {
  await fs.writeFile(configFilePath, ini.stringify(updatedConfig), 'utf8')

  // Nice to have: Only apply a diff, don't overwrite file, to keep comments, whitespaces, etc.
}
