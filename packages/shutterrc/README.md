# @shutter/shutterrc

Locate and parse the shutter configuration file, `.shutterrc`. Will start looking for `.shutterrc` in the currently working directory, then traverse its parents and finally try the user's home directory.

## API

```ts
import { loadShutterConfig } from '@shutter/shutterrc'
```

### `loadShutterConfig(directoryPath: string = process.cwd()): Promise<ShutterConfig>`

Locate the `.shutterrc` file, read and parse it. Start looking in `directoryPath`.

### `updateShutterConfig(configFilePath: string, updatedConfig: ShutterConfig): Promise<void>`

Write an updated shutter configuration to a `.shutterrc` file. The targetted `.shutterrc` may already exist. If not, it will be created.

Pass the whole configuration, not just the entries to update.

### `getUserConfigPath(): string`

Returns the path to the user-specific `.shutterrc` file.

## Sample .shutterrc

```
authtoken=eyJhbGciO...
```
