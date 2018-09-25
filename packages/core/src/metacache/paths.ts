import * as os from 'os'
import * as path from 'path'

export const getSnapshotSetsCachePath = () => path.join(os.homedir(), '.shutter', 'cache', 'snapshotsets')
