import test from 'ava'
import * as fs from 'mz/fs'
import * as path from 'path'
import * as os from 'os'
import createShutter from '../src'
import { isDirectory, isFile } from './helpers/fs'

require('dotenv').load()

test.serial('snapshot set cache is updated', async t => {
  const shutter = createShutter(__dirname)
  await shutter.snapshot('button', '<button>Click me!</button>')
  await shutter.snapshot('link', '<a href="https://shutter.sh/">Proceed to shutter.sh</a>')
  const results = await shutter.finish()

  // Test overall cache:

  const snapshotSetsCachePath = path.join(os.homedir(), '.shutter', 'cache', 'snapshotsets')
  t.true(await isDirectory(snapshotSetsCachePath))

  const snapshotSetCacheItemPath = path.join(snapshotSetsCachePath, results[0].snapshotSetID)
  t.true(await isFile(snapshotSetCacheItemPath))

  // Test cache item:

  const cacheItem = JSON.parse(await fs.readFile(snapshotSetCacheItemPath, 'utf8'))
  t.is(cacheItem.id, results[0].snapshotSetID)
  t.is(cacheItem.snapshots.length, 2)

  t.is(cacheItem.snapshots[0].id, results[0].snapshotID)
  t.is(cacheItem.snapshots[0].snapshotFilePath, path.join(__dirname, 'snapshots', 'button.png'))
  t.is(cacheItem.snapshots[0].testName, 'button')
  t.is(cacheItem.snapshots[1].id, results[1].snapshotID)
  t.is(cacheItem.snapshots[1].snapshotFilePath, path.join(__dirname, 'snapshots', 'link.png'))
  t.is(cacheItem.snapshots[1].testName, 'link')

  // Test pointer to latest snapshot set:

  const latestSnapshotSetPath = path.join(snapshotSetsCachePath, '.latest')
  t.true(await isFile(latestSnapshotSetPath))

  const latestSnapshotSetID = JSON.parse(await fs.readFile(latestSnapshotSetPath, 'utf8'))
  t.is(latestSnapshotSetID, results[0].snapshotSetID)
})
