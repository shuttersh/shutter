import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import createShutter, {
  addFile,
  createFileFromBuffer,
  ShutterCreationOptions as CoreShutterCreationOptions,
  SnapshotOptions as CoreSnapshotOptions,
  TestResult
} from '@shutter/core'

export { addFile, createFileFromBuffer, TestResult }

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type HTMLString = string
export type BuiltinRenderFunction = (reactElement: ReactElement<any>) => Promise<HTMLString>

/**
 * The 2nd argument to the function (`originalRender`) is deprecated and will be removed soon.
 * Import the `renderComponent()` function instead.
 */
export type RenderFunction = (reactElement: ReactElement<any>, originalRender: BuiltinRenderFunction) => Promise<HTMLString>

export type ShutterCreationOptions = Omit<CoreShutterCreationOptions, 'head'> & {
  head?: React.ReactElement<any>,
  render?: RenderFunction
}

export interface SnapshotOptions extends CoreSnapshotOptions {
  render?: RenderFunction
}

export const renderComponent = (element: ReactElement<any>): Promise<HTMLString> => {
  return Promise.resolve(renderToStaticMarkup(element))
}

const createReactShutter = (testsDirectoryPath: string, shutterOptions: ShutterCreationOptions = {}) => {
  const shutterCoreOptions = {
    ...shutterOptions,
    head: shutterOptions.head ? renderToStaticMarkup(shutterOptions.head) : ''
  }
  const shutter = createShutter(testsDirectoryPath, shutterCoreOptions)

  return {
    ...shutter,

    async snapshot (testName: string, element: ReactElement<any>, options: SnapshotOptions = {}) {
      const render = options.render || shutterOptions.render || renderComponent

      const html = await render(element, renderComponent)
      return shutter.snapshot(testName, html, options)
    }
  }
}

export default createReactShutter
