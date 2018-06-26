# @shutter/react [![NPM Version](https://img.shields.io/npm/v/@shutter/react.svg)](https://www.npmjs.com/package/@shutter/react)

React.js visual snapshot testing library using [shutter.sh](https://shutter.sh).

Renders React components to PNG snapshots using the shutter.sh service and saves snapshots locally. Future test runs will re-render the content and diff it against your previously saved snapshot.

The tests will fail if the current snapshot does not match the expected one. If that visual change was intended, you can update your local snapshot.


## Installation

```sh
npm install --save-dev @shutter/core
# or using yarn:
yarn add --dev @shutter/core
```

## Usage

```jsx
import createReactShutter from '@shutter/react'
import Button from './button'

const shutter = createReactShutter(__dirname)

describe('Button component', function () {
  after(async function () {
    // Collect and evaluate results once we are done
    await shutter.finish()
  })

  it('matches visual snapshot', async function () {
    await shutter.snapshot(<Button label='Click me' />)
  })

  it('with primary style matches visual snapshot', async function () {
    await shutter.snapshot(<Button primary label='Click me' />)
  })
})
```

When running this test, `@shutter/react` will render your button in the desired states and compare the resulting snapshots to your previous component snapshots.

It will also print an inspection URL which links to the shutter.sh app where you can see the rendered component, the expected outcome and a visual diff between them.

## API

```ts
import createReactShutter from '@shutter/react'

const shutter = createReactShutter(__dirname)
```

### `createReactShutter(testDirectoryPath: string, options: ShutterOptions): Shutter`

Creates a shutter instance. You need to pass your testing directory (can usually just use `__dirname`), so it knows where to save the snapshots.

```ts
interface ShutterOptions {
  layout?: (htmlContent: string) => string,
  render?: (reactElement: ReactElement<any>, originalRender: function) => Promise<string>,
  snapshotsPath?: string,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
}
```

Check out the [`@shutter/api` documentation](../api/README.md) for the `DiffOptions` and `RenderOptions` details.

### `shutter.snapshot(testName: string, element: ReactElement<any>, options: SnapshotOptions = {}): Promise<void>`

Send page contents to the shutter.sh service to be rendered.

The returned promise will resolve once the upload is done, but before the rendering has finished. That is why you need to call `shutter.finish()` after calling `shutter.snapshot()` the last time.

```ts
interface SnapshotOptions {
  layout?: (htmlContent: string) => string,
  render?: (reactElement: ReactElement<any>, originalRender: function) => Promise<string>,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
}
```

The options are mostly the same as the `ShutterOptions`. They can be used to override the options per test case.

Check out the [`@shutter/api` documentation](../api/README.md) for the `DiffOptions` and `RenderOptions` details.

### `shutter.finish(): Promise<TestResult[]>`

Waits until all rendering tasks have finished, then collects and evaluates the results.

Will throw with a test results summary if snapshots don't match. Prints a success message and an inspection link if everything matched.

### Custom render function

You can pass a custom render function to `createReactShutter()` or `shutter.snapshot()`. The render function takes a React element and returns a string of static HTML. The default render function is just a thin wrapper around `ReactDOMServer.renderToStaticMarkup()`.

```ts
export type HTMLString = string
export type BuiltinRenderFunction = (reactElement: ReactElement<any>) => Promise<HTMLString>
export type RenderFunction = (reactElement: ReactElement<any>, originalRender: BuiltinRenderFunction) => Promise<HTMLString>
```

Use it wrap your components in other components, like context providers:

```jsx
import { Provider } from 'react-redux'
import createReactShutter from '@shutter/react'
import store from './store'

const render = (element, baseRender) => {
  return baseRender(
    <Provider store={store}>
      {element}
    </Provider>
  )
}

const shutter = createReactShutter(__dirname, { render })
```

## See also

Check out the documentation page at <https://shuttersh.github.io/shutter/>.
