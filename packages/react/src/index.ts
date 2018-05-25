import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import createShutter, {
  ShutterCreationOptions as CoreShutterCreationOptions,
  SnapshotOptions as CoreSnapshotOptions,
  TestResult
} from '@shutter/core'

export { TestResult }

export type HTMLString = string
export type BuiltinRenderFunction = (reactElement: ReactElement<any>) => Promise<HTMLString>
export type RenderFunction = (reactElement: ReactElement<any>, originalRender: BuiltinRenderFunction) => Promise<HTMLString>

export interface ShutterCreationOptions extends CoreShutterCreationOptions {
  render?: RenderFunction
}

export interface SnapshotOptions extends CoreSnapshotOptions {
  render?: RenderFunction
}

const defaultRender = (element: ReactElement<any>): Promise<HTMLString> => {
  return Promise.resolve(renderToStaticMarkup(element))
}

const createReactShutter = (testsDirectoryPath: string, shutterOptions: ShutterCreationOptions = {}) => {
  const shutter = createShutter(testsDirectoryPath, shutterOptions)

  return {
    ...shutter,

    async snapshot (testName: string, element: ReactElement<any>, options: SnapshotOptions = {}) {
      const render = options.render || shutterOptions.render || defaultRender

      const html = await render(element, defaultRender)
      return shutter.snapshot(testName, html, options)
    }
  }
}

export default createReactShutter
