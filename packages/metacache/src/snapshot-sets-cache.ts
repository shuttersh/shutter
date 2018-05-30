import { openJSONCache, JSONCache } from './json-cache'
import { getSnapshotSetsCachePath } from './paths'

export interface SnapshotSetsCache extends JSONCache<SnapshotSetCacheEntry | LatestSnapshotSetEntry> {}

export interface SnapshotSetCacheEntry {
  id: string,
  snapshots: {
    id: string,
    match: boolean,
    snapshotFilePath: string,
    testName: string
  }[]
}

export type LatestSnapshotSetEntry = string

export const openSnapshotSetsCache = async (): Promise<SnapshotSetsCache> => {
  return openJSONCache(getSnapshotSetsCachePath())
}
