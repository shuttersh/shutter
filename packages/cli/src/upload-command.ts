import { createSnapshot, getProcessedSnapshot } from './api'

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

interface UploadOptions {
  shutterHost: string,
  waitUntilFinished?: boolean
}

const uploadTestcase = async (paths: string[], options: UploadOptions) => {
  const { shutterHost } = options

  const { htmlPath, assetPaths } = identifyFilePaths(paths)

  console.error(`Uploading...`)
  const snapshot = await createSnapshot(shutterHost, htmlPath, assetPaths)

  if (options.waitUntilFinished) {
    console.error(`Waiting for test case to be processed...`)
    const startTime = Date.now()
    const uptodateSnapshot = await getProcessedSnapshot(shutterHost, snapshot.id)
    console.error(`Done. Took ${formatMsToSeconds(Date.now() - startTime)}s.`)
    console.log(JSON.stringify(uptodateSnapshot, null, 2))
  } else {
    console.log(JSON.stringify(snapshot, null, 2))
  }
}

export default uploadTestcase
