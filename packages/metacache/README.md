# @shutter/metacache [![NPM Version](https://img.shields.io/npm/v/@shutter/metacache.svg)](https://www.npmjs.com/package/@shutter/metacache)

Managing persistent cache data on disk, like the snapshot sets cache.

## API

### `getSnapshotSetsCachePath(): string`

### `openJSONCache<Value = any>(directoryPath: string): Promise<JSONCache>`

### `JSONCache<Value>`

```ts
interface JSONCache<Value> {
  save (key: string, content: Value): Promise<any>
  read (key: string): Promise<Value>
  has (key: string): Promise<boolean>
}
```
