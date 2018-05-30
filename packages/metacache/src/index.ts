import * as fs from 'mz/fs'
import * as path from 'path'
import * as os from 'os'
import mkdirpCallback from 'mkdirp'

export interface JSONCache<Value> {
  save (key: string, content: Value): Promise<any>
  read (key: string): Promise<Value>
  has (key: string): Promise<boolean>
}

const mkdirp = (directoryPath: string) => new Promise((resolve, reject) => mkdirpCallback(directoryPath, error => error ? reject(error) : resolve()))

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

export const getSnapshotSetsCachePath = () => path.join(os.homedir(), '.shutter', 'cache', 'snapshotsets')

export const openJSONCache = async <Value = any>(directoryPath: string) => {
  const getFilePath = (filePath: string) => path.join(directoryPath, filePath)

  // Create directory if it doesn't exist yet
  await mkdirp(directoryPath)

  const cache: JSONCache<Value> = {
    save (key: string, content: Value) {
      return fs.writeFile(getFilePath(key), JSON.stringify(content), 'utf8')
    },
    async read (key: string) {
      const unparsed = await fs.readFile(getFilePath(key), 'utf8')
      return JSON.parse(unparsed) as Value
    },
    has (key: string) {
      return isFile(getFilePath(key))
    }
  }
  return cache
}
