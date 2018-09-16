import { collectMetadata } from '@shutter/builddata'
import { readFile } from 'mz/fs'
import * as path from 'path'
import kebabCase from 'dashify'
import defaultLayout from './default-layout'
import { loadShutterConfig } from './shutterrc'
import { openSnapshotSetsCache, updateSnapshotSetCache } from './snapshot-sets-cache'
import {
  createFileFromBuffer,
  createSnapshot,
  loadFileFromDisk,
  retrieveProcessedSnapshot,
  File,
  DiffOptions,
  RenderOptions
} from '@shutter/api'
import {
  createInspectionURL,
  createResultData,
  formatTestResultsOverview,
  formatSuccessMessage,
  syncSnapshot,
  TestCase,
  TestResult
} from './results'

export { createFileFromBuffer, File, TestResult }

export type HTMLString = string
export type Layout = (content: HTMLString, head: HTMLString) => HTMLString

export interface ShutterCreationOptions {
  /** Local files to upload, like stylesheets. Use `addFile()` to populate this array. */
  files?: File[],

  /** Custom content to go into the <head> tag of the document. */
  head?: HTMLString,

  /** Layout to use for rendering. Pass a custom layout to change the overall page structure. */
  layout?: Layout,

  /** Set a custom path to your local snapshot files here. */
  snapshotsPath?: string,

  /** Set custom image comparison options here. Used to compare the current snapshot to the expectation. */
  diffOptions?: DiffOptions,

  /** Set custom rendering options here. */
  renderOptions?: RenderOptions
}

export interface SnapshotOptions {
  /** Layout to use for rendering. Pass a custom layout to change the overall page structure. */
  layout?: Layout,

  /** Set custom image comparison options here. Used to compare the current snapshot to the expectation. */
  diffOptions?: DiffOptions,

  /** Set custom rendering options here. */
  renderOptions?: RenderOptions
}

export const defaultComponentRenderOptions = {
  autoCrop: true,
  omitBackground: true
}

const getSnapshotsPath = (snapshotsPath: string, testID: string) => path.join(snapshotsPath, `${testID}.png`)
const shouldUpdateSnapshots = () => process.argv.includes('--update-shutter-snapshots') || Boolean(process.env.UPDATE_SHUTTER_SNAPSHOTS)

async function loadFileIfExists (filePath: string): Promise<File | null> {
  try {
    const fileContent = await readFile(filePath)
    return createFileFromBuffer(fileContent, path.basename(filePath))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

function createShutter (testsDirectoryPath: string, shutterOptions: ShutterCreationOptions = {}) {
  const snapshotsPath = shutterOptions.snapshotsPath || path.join(testsDirectoryPath, 'snapshots')
  const filesToSubmit = shutterOptions.files || []

  let finishCalled: boolean = false
  let tests: TestCase[] = []

  const metadataCollectionPromise = collectMetadata()
  const shutterConfigPromise = loadShutterConfig()
  const snapshotSetsCachePromise = openSnapshotSetsCache()

  return {
    async snapshot (testName: string, html: HTMLString, options: SnapshotOptions = {}) {
      const testRunLabels = await metadataCollectionPromise
      const shutterConfig = await shutterConfigPromise

      if (!shutterConfig.authtoken) {
        throw new Error('No auth token found in .shutterrc file. Run `npx shutter login` or copy an auth token to the .shutterrc file.')
      }

      const labels = { ...testRunLabels, 'test:name': testName }
      const layout = shutterOptions.layout || options.layout || defaultLayout
      const diffOptions = { ...shutterOptions.diffOptions, ...options.diffOptions }
      const renderOptions = { ...defaultComponentRenderOptions, ...shutterOptions.renderOptions, ...options.renderOptions }

      const testID = kebabCase(testName)
      const documentHTML = layout(html, shutterOptions.head || '')

      const htmlPage = await createFileFromBuffer(Buffer.from(documentHTML, 'utf8'), 'index.html')
      const expectationFilePath = getSnapshotsPath(snapshotsPath, testID)
      const expectation = await loadFileIfExists(expectationFilePath)

      const unprocessedSnapshot = await createSnapshot(shutterConfig.authtoken, htmlPage, filesToSubmit, { diffOptions, expectation, labels, renderOptions })
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

    async finish (): Promise<TestResult[]> {
      finishCalled = true

      const results = await Promise.all(
        tests.map(async test => {
          await syncSnapshot(test, shouldUpdateSnapshots())
          return createResultData(test)
        })
      )
      const testsFailed = results.some(result => !result.match)
      const inspectionLine = results.length > 0 ? `Inspect the snapshots at <${createInspectionURL(results[0])}>` : ''

      const snapshotSetsCache = await snapshotSetsCachePromise
      await updateSnapshotSetCache(snapshotSetsCache, results)

      if (testsFailed && !shouldUpdateSnapshots()) {
        const shutterUpdateLine = 'If changes were intended, run `npx shutter update`.'
        throw new Error(`Shutter tests failed. Tests:\n${formatTestResultsOverview(results)}\n${inspectionLine}\n${shutterUpdateLine}`)
      } else {
        console.log(formatSuccessMessage(results))
        console.log(inspectionLine)
      }
      return results
    }
  }
}

export default createShutter

export async function addFile (localPath: string, serveAsPath: string) {
  return loadFileFromDisk(localPath, { fileName: serveAsPath })
}
