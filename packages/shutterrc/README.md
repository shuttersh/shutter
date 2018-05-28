# @shutter/shutterrc

Locate and parse the shutter configuration file, `.shutterrc`. Will start looking for `.shutterrc` in the currently working directory, then traverse its parents and finally try the user's home directory.

## API

```ts
import { loadShutterConfig } from '@shutter/shutterrc'
```

### `loadShutterConfig(directoryPath: string = process.cwd()): Promise<ShutterConfig>`

Locate the `.shutterrc` file, read and parse it. Start looking in `directoryPath`.

## Sample .shutterrc

```
authtoken=eyJhbGciO...
```
