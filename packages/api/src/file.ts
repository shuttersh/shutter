import * as fs from 'fs'
import { lookup } from 'mime-types'
import * as path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

export interface File {
  readonly contentType: string | null
  readonly fileName: string
  getContent: () => Promise<Buffer>
}

export interface FromBufferOptions {
  contentType?: string
}

export interface FromFSOptions {
  contentType?: string,
  fileName?: string
}

export const createFileFromBuffer = (content: Buffer, fileName: string, options: FromBufferOptions = {}): File => {
  return {
    fileName,
    contentType: options.contentType || null,
    getContent: () => Promise.resolve(content)
  }
}

export const loadFileFromDisk = async (filePath: string, options: FromFSOptions = {}): Promise<File> => {
  const fileName = options.fileName || path.basename(filePath)

  return {
    fileName,
    contentType: options.contentType || lookup(fileName) || null,
    getContent: () => readFile(filePath)
  }
}
