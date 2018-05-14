import { readFile } from 'mz/fs'
import * as path from 'path'
import kebabCase from 'dashify'
import defaultLayout from './default-layout'
import {
  createFileFromBuffer,
  createSnapshot,
  retrieveProcessedSnapshot,
  File,
  DiffOptions,
  RenderOptions
} from '@shutter/api'
import {
  createResultData,
  formatTestResultsOverview,
  formatSuccessMessage,
  syncSnapshot,
  TestCase
} from './results'

export type HTMLString = string

export interface ShutterCreationOptions {
  layout?: (content: HTMLString) => HTMLString,
  expectationsPath?: string,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
}

export interface SnapshotOptions {
  layout?: (content: HTMLString) => HTMLString,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
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

const createShutter = (testsDirectoryPath: string, shutterOptions: ShutterCreationOptions = {}) => {
  const expectationsPath = shutterOptions.expectationsPath || path.join(testsDirectoryPath, 'snapshots')
  const updateSnapshots = process.argv.includes('--update-shutter-snapshots') || Boolean(process.env.UPDATE_SHUTTER_SNAPSHOTS)

  let finishCalled: boolean = false
  let tests: TestCase[] = []

  return {
    async snapshot (testName: string, html: HTMLString, options: SnapshotOptions = {}) {
      const layout = shutterOptions.layout || options.layout || defaultLayout
      const diffOptions = { ...shutterOptions.diffOptions, ...options.diffOptions }
      const renderOptions = { ...defaultComponentRenderOptions, ...shutterOptions.renderOptions, ...options.renderOptions }

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
        tests.map(async test => {
          await syncSnapshot(test, updateSnapshots)
          return createResultData(test)
        })
      )
      const testsFailed = results.some(result => !result.match)

      if (testsFailed && !updateSnapshots) {
        throw new Error(formatTestResultsOverview(results))
      } else {
        console.log(formatSuccessMessage(results))
      }
    }

    // TODO: `addDirectory()`, `addFile()`
  }
}

export default createShutter
