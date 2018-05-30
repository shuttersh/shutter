import { retrieveFile, retrieveProcessedSnapshot } from '@shutter/api'
import { openSnapshotSetsCache, LatestSnapshotSetEntry, SnapshotSetCacheEntry } from '@shutter/metacache'
import * as inquirer from 'inquirer'
import * as fs from 'mz/fs'
import { CommandFunction } from '../command'

export const help = `
  Usage
    Interactive:
    $ shutter update

    Non-interactive:
    $ shutter update <snapshotID | testName> [...]

  Options
    --help              Show this help.
`

const getSnapshotIDsToUpdate = async (snapshotSet: SnapshotSetCacheEntry, args: string[]) => {
  if (args.length > 0) {
    // Non-interactive mode
    return args.map(arg => {
      const snapshot = snapshotSet.snapshots.find(snapshot => snapshot.id === arg || snapshot.testName === arg)

      if (!snapshot) {
        throw new Error(
          `No snapshot with a matching ID or test name found for "${arg}".\n` +
          `Snapshots in the latest snapshot set: ${JSON.stringify(snapshotSet.snapshots, null, 2)}`
        )
      }
      return snapshot.id
    })
  } else {
    // Interactive mode
    const choices = snapshotSet.snapshots
      .filter(snapshot => !snapshot.match)
      .map(snapshot => ({ name: snapshot.testName, value: snapshot.id }))

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'snapshotIDs',
        message: 'Which snapshots do you like to update?',
        choices: choices
      }
    ]) as { snapshotIDs: string[] }

    return answers.snapshotIDs
  }
}

const updateSnapshot = async (snapshot: SnapshotSetCacheEntry['snapshots'][0]) => {
  const fullSnapshotData = await retrieveProcessedSnapshot(snapshot.id)
  const blob = await retrieveFile(fullSnapshotData.result.rendered)
  await fs.writeFile(snapshot.snapshotFilePath, blob)
}

export const command: CommandFunction = async (args: string[], flags: {}) => {
  const snapshotSetsCache = await openSnapshotSetsCache()

  if (!await snapshotSetsCache.has('.latest')) throw new Error(`No pointer to latest snapshot set found in cache. Did you even create snapshots before?`)
  const snapshotSetID = await snapshotSetsCache.read('.latest') as LatestSnapshotSetEntry   // tslint:disable-line
  const snapshotSet = await snapshotSetsCache.read(snapshotSetID) as SnapshotSetCacheEntry  // tslint:disable-line

  const snapshotIDsToUpdate = await getSnapshotIDsToUpdate(snapshotSet, args)
  const snapshotsToUpdate = snapshotSet.snapshots.filter(snapshot => snapshotIDsToUpdate.indexOf(snapshot.id) > -1)

  if (snapshotsToUpdate.length === 0) {
    console.error(`Didn't select any snapshots for update. Quitting.`)
    return process.exit()
  }

  console.log(`Updating snapshots...`)
  await Promise.all(
    snapshotsToUpdate.map(snapshot => updateSnapshot(snapshot))
  )

  console.log(`Done.`)
}
