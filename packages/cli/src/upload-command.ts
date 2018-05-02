import { createTestcase, retrieveTestcase } from './api'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const round = (number: number, decimalPlaces: number) => Math.round(number * (10 ** decimalPlaces)) / (10 ** decimalPlaces)
const formatMsToSeconds = (ms: number) => round(ms / 1000, 1)

const identifyFilePaths = (paths: string[]) => {
  const htmlExtensionPaths = paths.filter(path => path.toLowerCase().endsWith('.html'))
  const pathsWithoutExtension = paths.filter(path => !path.includes('.'))

  const htmlPath = (() => {
    if (htmlExtensionPaths.length === 1) {
      return htmlExtensionPaths[0]
    } else if (htmlExtensionPaths.length > 1) {
      throw new Error(`More than one .html file path passed. Expected exactly one.`)
    } else if (pathsWithoutExtension.length === 1 && paths[0] === pathsWithoutExtension[0]) {
      return pathsWithoutExtension[0]
    } else {
      throw new Error(`No HTML document passed.`)
    }
  })()

  const assetPaths = paths.filter(path => path !== htmlPath)

  return {
    htmlPath,
    assetPaths
  }
}

const pollUntilTestcaseFinished = async (shutterHost: string, testcaseID: string) => {
  const timeout = 20000
  const pollingDelay = 200

  const startTimestamp = Date.now()

  while (Date.now() - startTimestamp < timeout) {
    const testcase = await retrieveTestcase(shutterHost, testcaseID)

    if (testcase.processingCompletedAt) {
      return testcase
    } else {
      await delay(pollingDelay)
    }
  }

  throw new Error(`Not waiting anymore for the test case to processed (${testcaseID}). Reached timeout of ${formatMsToSeconds(timeout)}s.`)
}

interface UploadOptions {
  shutterHost: string,
  testRunID?: string,
  name?: string,
  waitUntilFinished?: boolean
}

const uploadTestcase = async (paths: string[], options: UploadOptions) => {
  const { name, shutterHost, testRunID } = options

  if (!testRunID) throw new Error(`No test run ID given.`)
  if (!name) throw new Error(`No test case name given.`)

  const { htmlPath, assetPaths } = identifyFilePaths(paths)

  console.error(`Uploading...`)
  const testcase = await createTestcase(shutterHost, { testRunID, name }, htmlPath, assetPaths)

  if (options.waitUntilFinished) {
    console.error(`Waiting for test case to be processed...`)
    const startTime = Date.now()
    const uptodateTestcase = await pollUntilTestcaseFinished(shutterHost, testcase.id)
    console.error(`Done. Took ${formatMsToSeconds(Date.now() - startTime)}s.`)
    console.log(JSON.stringify(uptodateTestcase, null, 2))
  } else {
    console.log(JSON.stringify(testcase, null, 2))
  }
}

export default uploadTestcase
