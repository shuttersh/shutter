import { getSnapshotSetsCachePath, openJSONCache, JSONCache } from '@shutter/metacache'
import { TestResult } from './results'

export type SnapshotSetsCache = JSONCache<SnapshotSetCacheEntry | LatestSnapshotSetEntry>

export interface SnapshotSetCacheEntry {
  id: string,
  snapshots: {
    id: string,
    snapshotFilePath: string,
    testName: string
  }[]
}

export type LatestSnapshotSetEntry = string

const dedupe = <Entry>(array: Entry[]): Entry[] => Array.from(new Set(array))
const lastItem = <Entry>(array: Entry[]) => array[array.length - 1]

export const openSnapshotSetsCache = async (): Promise<SnapshotSetsCache> => {
  const cache = await openJSONCache(getSnapshotSetsCachePath())
  return cache
}

export const updateSnapshotSetCache = async (cache: SnapshotSetsCache, results: TestResult[]) => {
  const snapshotSetIDs = dedupe(results.map(result => result.snapshotSetID))

  // Normally there should only be one snapshot set for one test run, but better be safe than sorry...
  for (const snapshotSetID of snapshotSetIDs) {
    const resultsInSnapshotSet = results.filter(result => result.snapshotSetID === snapshotSetID)

    const snapshots = resultsInSnapshotSet.map(result => ({
      id: result.snapshotID,
      snapshotFilePath: result.expectationFilePath,
      testName: result.testName
    }))

    await cache.save(snapshotSetID, {
      id: snapshotSetID,
      snapshots
    })
  }

  await cache.save('.latest', lastItem(snapshotSetIDs))
}
