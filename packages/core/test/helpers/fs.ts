import * as fs from 'mz/fs'

export const isDirectory = async (dirPath: string) => {
  try {
    const stat = await fs.stat(dirPath)
    return stat.isDirectory()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

export const isFile = async (filePath: string) => {
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
