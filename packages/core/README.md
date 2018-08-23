# @shutter/core [![NPM Version](https://img.shields.io/npm/v/@shutter/core.svg)](https://www.npmjs.com/package/@shutter/core)

Core testing library for [shutter.sh](https://shutter.sh). This is the framework-agnostic base code that the framework-specific packages are based on.

Pass an HTML document and additional assets to the library which will render a PNG snapshot using the shutter.sh service and save that snapshot locally. Future test runs will re-render the content and diff it against your previously saved snapshot.

The tests will fail if the current snapshot does not match the expected one. If that visual change was intended, you can update your local snapshot.


## API

```ts
import createShutter from '@shutter/core'

const shutter = createShutter(__dirname)
shutter.snapshot('New UI', '<div>Renders any HTML.</div>')
```

To upload local files:

```ts
import createShutter, { addFile } from '@shutter/core'
import * as path from 'path'

const files = await Promise.all([
  addFile(path.join(__dirname, 'styles.css'), '/styles.css')
])
const head = `
  <link href="/styles.css" rel="stylesheet" />
`

const shutter = createShutter(__dirname, { files, head })
shutter.snapshot('New UI', '<div class="my-content">Renders any HTML.</div>')
```


### `createShutter(testDirectoryPath: string, options: ShutterOptions): Shutter`

Creates a shutter instance. You need to pass your testing directory (can usually just use `__dirname`), so it knows where to save the snapshots.

```ts
interface ShutterOptions {
  /** Local files to upload, like stylesheets. Use `addFile()` to populate this array. */
  files?: File[],

  /** Custom content to go into the <head> tag of the document. */
  head?: string,

  /** Layout to use for rendering. Pass a custom layout to change the overall page structure. */
  layout?: (bodyContent: string, headContent: string) => string,

  /** Set a custom path to your local snapshot files here. */
  snapshotsPath?: string,

  /** Set custom image comparison options here. Used to compare the current snapshot to the expectation. */
  diffOptions?: DiffOptions,

  /** Set custom rendering options here. */
  renderOptions?: RenderOptions
}
```

Check out the [`@shutter/api` documentation](../api/README.md) for the `File`, `DiffOptions` and `RenderOptions` details.

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

### `shutter.addFile(localPath: string, serveAsPath: string): Promise<File>`

Reads a local file and prepares it for submission along the HTML content to render. Use it to submit local stylesheets, images, etc.

Pass the resulting `File` to `createShutter()` as `options.files`.

## See also

Check out the documentation page at <https://shuttersh.github.io/shutter/>.
