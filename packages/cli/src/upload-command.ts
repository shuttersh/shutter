import { createTestcase } from './api'

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
  testRunID?: string,
  name?: string
}

const uploadTestcase = async (paths: string[], options: UploadOptions) => {
  const { name, shutterHost, testRunID } = options

  if (!testRunID) throw new Error(`No test run ID given.`)
  if (!name) throw new Error(`No test case name given.`)

  const { htmlPath, assetPaths } = identifyFilePaths(paths)

  console.error(`Uploading...`)
  const testcase = await createTestcase(shutterHost, { testRunID, name }, htmlPath, assetPaths)

  console.log(JSON.stringify(testcase, null, 2))
}

export default uploadTestcase
