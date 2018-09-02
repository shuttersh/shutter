import { renderToString } from '@vue/server-test-utils'
import createShutter, {
  addFile,
  createFileFromBuffer,
  ShutterCreationOptions,
  SnapshotOptions,
  TestResult
} from '@shutter/core'

export { addFile, createFileFromBuffer, TestResult }

const createVueShutter = (testsDirectoryPath: string, shutterOptions: ShutterCreationOptions = {}) => {
  const shutter = createShutter(testsDirectoryPath, shutterOptions)

  return {
    ...shutter,

    async snapshot (testName: string, element: object, options: SnapshotOptions = {}) {
      return shutter.snapshot(testName, renderToString(element), options)
    }
  }
}

export default createVueShutter
