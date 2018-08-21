# @shutter/core [![NPM Version](https://img.shields.io/npm/v/@shutter/core.svg)](https://www.npmjs.com/package/@shutter/core)

Core testing library for [shutter.sh](https://shutter.sh). This is the framework-agnostic base code that the framework-specific packages are based on.

Pass an HTML document and additional assets to the library which will render a PNG snapshot using the shutter.sh service and save that snapshot locally. Future test runs will re-render the content and diff it against your previously saved snapshot.

The tests will fail if the current snapshot does not match the expected one. If that visual change was intended, you can update your local snapshot.


## API

```ts
import createShutter from '@shutter/core'

const shutter = createShutter(__dirname)
```

### `createShutter(testDirectoryPath: string, options: ShutterOptions): Shutter`

Creates a shutter instance. You need to pass your testing directory (can usually just use `__dirname`), so it knows where to save the snapshots.

```ts
interface ShutterOptions {
  head?: string,
  layout?: (htmlContent: string, headContent: string) => string,
  snapshotsPath?: string,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
}
```

Check out the [`@shutter/api` documentation](../api/README.md) for the `DiffOptions` and `RenderOptions` details.

### `shutter.snapshot(testName: string, html: string, options: SnapshotOptions = {}): Promise<void>`

Send page contents to the shutter.sh service to be rendered.

The returned promise will resolve once the upload is done, but before the rendering has finished. That is why you need to call `shutter.finish()` after calling `shutter.snapshot()` the last time.

```ts
interface SnapshotOptions {
  layout?: (htmlContent: string) => string,
  diffOptions?: DiffOptions,
  renderOptions?: RenderOptions
}
```

The options are mostly the same as the `ShutterOptions`. They can be used to override the options per test case.

Check out the [`@shutter/api` documentation](../api/README.md) for the `DiffOptions` and `RenderOptions` details.

### `shutter.finish(): Promise<TestResult[]>`

Waits until all rendering tasks have finished, then collects and evaluates the results.

Will throw with a test results summary if snapshots don't match. Prints a success message and an inspection link if everything matched.

## See also

Check out the documentation page at <https://shuttersh.github.io/shutter/>.
