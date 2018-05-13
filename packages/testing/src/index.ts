import { readFile } from 'mz/fs'
import * as path from 'path'
import kebabCase from 'dashify'
import { createFileFromBuffer, createSnapshot, retrieveProcessedSnapshot, File } from '@shutter/api'
import defaultLayout from './default-layout'
import { createResultData, formatTestResultsOverview, formatSuccessMessage, TestCase } from './results'

export type HTMLString = string

export interface ShutterCreationOptions {
  expectationsPath?: string,
  diffOptions?: any,
  layout?: (content: HTMLString) => HTMLString,
  renderOptions?: any
}

export const defaultComponentRenderOptions = {
  autoCrop: true,
  omitBackground: true
}

const getExpectationPath = (expectationsPath: string, testID: string) => path.join(expectationsPath, `${testID}.png`)

const loadFileIfExists = async (filePath: string): Promise<File | null> => {
  try {
    const fileContent = await readFile(filePath)
    return createFileFromBuffer(fileContent, path.basename(filePath))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

export const createShutter = (testsDirectoryPath: string, options: ShutterCreationOptions = {}) => {
  const {
    expectationsPath = path.join(testsDirectoryPath, 'snapshots'),
    layout = defaultLayout,
    diffOptions = null,
    renderOptions = defaultComponentRenderOptions
  } = options

  let finishCalled: boolean = false
  let tests: TestCase[] = []

  return {
    async snapshot (testName: string, html: HTMLString) {
      const testID = kebabCase(testName)
      const documentHTML = layout(html)

      const htmlPage = await createFileFromBuffer(Buffer.from(documentHTML, 'utf8'), 'index.html')
      const expectationFilePath = getExpectationPath(expectationsPath, testID)
      const expectation = await loadFileIfExists(expectationFilePath)

      const unprocessedSnapshot = await createSnapshot(htmlPage, [], { diffOptions, expectation, renderOptions })
      const processedSnapshotPromise = retrieveProcessedSnapshot(unprocessedSnapshot.id)

      tests.push({
        testName,
        expectationFilePath,
        expectationFileNotPresent: !expectation,
        processedSnapshotPromise
      })

      const isFirstTest = tests.length === 1

      if (isFirstTest) {
        // Only set up once: Throw an error if snapshots are created, but `.finish()` is never called
        process.on('exit', () => {
          if (!finishCalled) throw new Error(`Shutter snapshots created, but shutter.finish() was never invoked.`)
        })
      }
    },

    async finish () {
      finishCalled = true

      const results = await Promise.all(
        tests.map(test => createResultData(test))
      )
      const testsFailed = results.some(result => !result.match)

      if (testsFailed) {
        throw new Error(formatTestResultsOverview(results))
      } else {
        console.log(formatSuccessMessage(results))
      }
    }

    // TODO: `addDirectory()`, `addFile()`
  }
}
