import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { Collector } from '../types'

const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

async function fileExists (filePath: string) {
  try {
    const file = await stat(filePath)
    return file.isFile()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

const npm: Collector = {
  name: 'npm',

  testEnvironment (dirPath: string) {
    return fileExists(path.join(dirPath, 'package.json'))
  },

  async collect (dirPath) {
    const packageJsonContents = await readFile(path.join(dirPath, 'package.json'), 'utf8')
    const packageMetadata = JSON.parse(packageJsonContents)

    return {
      'package:name': packageMetadata.name
    }
  }
}

export default npm
