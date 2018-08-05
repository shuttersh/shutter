# @shutter/api [![NPM Version](https://img.shields.io/npm/v/@shutter/api.svg)](https://www.npmjs.com/package/@shutter/api)

[Shutter.sh](https://shutter.sh/) API client package.

## API

```ts
import { createSnapshot, retrieveFile, loadFileFromDisk } from '@shutter/api'
```

### `createSnapshot(authToken: string, page: File, pageAssets: File[], options: SnapshotCreationOptions = {}): Promise<Snapshot>`

Sends an HTML document and additional assets to the shutter.sh service for rendering. Returns a promise that resolves upon finished upload. The snapshot will not have been rendered yet (see `retrieveProcessedSnapshot`).

```ts
interface SnapshotCreationOptions {
  expectation?: File | null,
  diffOptions?: DiffOptions,
  labels?: Labels,
  renderOptions?: RenderOptions
}

interface DiffOptions {
  autoCrop?: boolean,
  relativeThreshold?: number
}

interface RenderOptions {
  autoCrop?: boolean,
  omitBackground?: boolean
}

type Snapshot = any   // Not yet typed
```

### `retrieveFile(fileHash: string): Promise<Buffer>`

Takes a file hash as included in the `Snapshot` body and returns a promise that resolves to a `Buffer` containing the file contents.

### `retrieveProcessedSnapshot(snapshotID: string): Promise<Snapshot>`

Takes a snapshot ID and returns a promise resolving to the rendered snapshot once the rendering has completed.

### `createFileFromBuffer(content: Buffer, fileName: string, options: FromBufferOptions = {}): File`

Takes a `Buffer` and wraps it to become a `File`.

```ts
interface FromBufferOptions {
  contentType?: string
}
```

### `loadFileFromDisk(filePath: string, options: FromFSOptions = {}): Promise<File>`

Loads a file from the file system.

```ts
interface FromFSOptions {
  contentType?: string,
  fileName?: string
}
```

### `File`

```ts
interface File {
  readonly contentType: string | null
  readonly fileName: string
  getContent: () => Promise<Buffer>
}
```
