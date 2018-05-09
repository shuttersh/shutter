import { createSnapshot, retrieveProcessedSnapshot, loadFileFromDisk } from '@shutter/api'
import { CommandFunction } from '../command'

export const minimumArgs = 1

export const help = `
  Usage
    $ shutter push [<options>] <files...>

  Arguments
    Pass the path to an HTML file and optionally additional asset files (CSS/JS).

  Options
    --await-completion  Run until the snapshot has been processed. Optional.
    --help              Show this help.

  Environment
    SHUTTER_HOST        Shutter service endpoint to use. For development purposes.
                        Something like: https://api.shutter.sh/
`

interface Flags {
  awaitCompletion?: boolean
}

const round = (someNumber: number, decimalPlaces: number) => Math.round(someNumber * (10 ** decimalPlaces)) / (10 ** decimalPlaces)
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

export const command: CommandFunction = async (args: string[], flags: Flags) => {
  const paths = args
  const { htmlPath, assetPaths } = identifyFilePaths(paths)

  console.error(`Uploading...`)
  const htmlFile = await loadFileFromDisk(htmlPath)
  const assetFiles = await Promise.all(assetPaths.map(
    path => loadFileFromDisk(path)
  ))

  const snapshot = await createSnapshot(htmlFile, assetFiles)

  if (flags.awaitCompletion) {
    console.error(`Waiting for test case to be processed...`)
    const startTime = Date.now()
    const uptodateSnapshot = await retrieveProcessedSnapshot(snapshot.id)
    console.error(`Done. Took ${formatMsToSeconds(Date.now() - startTime)}s.`)
    console.log(JSON.stringify(uptodateSnapshot, null, 2))
  } else {
    console.log(JSON.stringify(snapshot, null, 2))
  }
}
