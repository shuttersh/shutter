import { openSnapshotSetsCache, SnapshotSetsCache } from './metacache'
import { TestResult } from './results'

export { openSnapshotSetsCache }

const dedupe = <Entry>(array: Entry[]): Entry[] => Array.from(new Set(array))
const lastItem = <Entry>(array: Entry[]) => array[array.length - 1]

export const updateSnapshotSetCache = async (cache: SnapshotSetsCache, results: TestResult[]) => {
  const snapshotSetIDs = dedupe(results.map(result => result.snapshotSetID))

  // Normally there should only be one snapshot set for one test run, but better be safe than sorry...
  for (const snapshotSetID of snapshotSetIDs) {
    const resultsInSnapshotSet = results.filter(result => result.snapshotSetID === snapshotSetID)

    const snapshots = resultsInSnapshotSet.map(result => ({
      id: result.snapshotID,
      match: result.match,
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
