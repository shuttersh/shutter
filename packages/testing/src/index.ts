import { readFile, writeFile } from 'mz/fs'
import mkdirpCallback from 'mkdirp'
import * as path from 'path'
import kebabCase from 'dashify'
import { URL } from 'url'
import { createFileFromBuffer, createSnapshot, retrieveFile, retrieveProcessedSnapshot, File } from '@shutter/api'
import defaultLayout from './default-layout'

export type HTMLString = string

export interface ShutterCreationOptions {
  expectationsPath?: string,
  diffOptions?: any,
  layout?: (content: HTMLString) => HTMLString,
  renderOptions?: any
}

interface TestCase {
  testName: string,
  expectationFilePath: string,
  expectationFileNotPresent: boolean,
  processedSnapshotPromise: Promise<any>
}

export const defaultComponentRenderOptions = {
  autoCrop: true,
  omitBackground: true
}

const createInspectionURL = (snapshotID: string) => {
  const shutterAppHost = process.env.SHUTTER_APP || 'https://app.shutter.sh/'
  return new URL(`/snapshot/${snapshotID}`, shutterAppHost).toString()
}

const getExpectationPath = (expectationsPath: string, testID: string) => path.join(expectationsPath, `${testID}.png`)

const mkdirp = (dirPath: string) => new Promise((resolve, reject) => mkdirpCallback(dirPath, error => error ? reject(error) : resolve()))

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
        tests.map(async test => {
          const snapshot = await test.processedSnapshotPromise
          const { match, rendered, similarity } = snapshot.result

          if (test.expectationFileNotPresent) {
            const renderedContent = await retrieveFile(rendered)
            await mkdirp(path.dirname(test.expectationFilePath))
            await writeFile(test.expectationFilePath, renderedContent)
          }

          return {
            expectationFileNotPresent: test.expectationFileNotPresent,
            match,
            similarity,
            snapshotID: snapshot.id,
            testName: test.testName
          }
        })
      )

      const testsFailed = results.some(result => !result.match)

      if (testsFailed) {
        const formattedTestcases = results
          .map(result => {
            return result.match
              ? `  ✔ ${result.testName}`
              : `  ✖ ${result.testName}\n     Similarity ${(result.similarity * 100).toFixed(2)}% - ${createInspectionURL(result.snapshotID)}`
          })
          .join('\n')
        throw new Error(`Shutter tests failed. Tests:\n${formattedTestcases}`)
      } else {
        console.log(`Shutter ran ${results.length} tests ✔`)
      }
    }

    // TODO: `addDirectory()`, `addFile()`
  }
}
