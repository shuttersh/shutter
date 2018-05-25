import test from 'ava'
import { load as loadEnv } from 'dotenv'
import execa from 'execa'
import * as fs from 'mz/fs'
import * as path from 'path'

loadEnv()

test('downloads a snapshot for missing expectation', async t => {
  const env = {
    SHUTTER_API: process.env.SHUTTER_API || ''
  }

  const scriptPath = path.join(__dirname, 'fixture-scripts', 'download-snapshot-missing-expectation', 'index.js')
  const { code: exitCode, stderr } = await execa.shell(`ts-node '${scriptPath}'`, { env })

  t.is(exitCode, 0, `Expected script to exit with code 0. Failed with: ${stderr}`)

  const snapshotsDirPath = path.join(__dirname, 'fixture-scripts', 'download-snapshot-missing-expectation', 'snapshots')
  t.true((await fs.stat(snapshotsDirPath)).isDirectory())

  const snapshotStat = await fs.stat(path.join(snapshotsDirPath, 'input-with-no-expectation.png'))
  t.true(snapshotStat.isFile())
  t.true(snapshotStat.size > 100)
})

test('can update a snapshot by command line option', async t => {
  const env = {
    SHUTTER_API: process.env.SHUTTER_API || ''
  }

  const scriptPath = path.join(__dirname, 'fixture-scripts', 'update-snapshot-by-flag', 'index.js')
  const { code: exitCode, stderr } = await execa.shell(`ts-node '${scriptPath}' --update-shutter-snapshots`, { env })

  t.is(exitCode, 0, `Expected script to exit with code 0. Failed with: ${stderr}`)

  const snapshotsDirPath = path.join(__dirname, 'fixture-scripts', 'update-snapshot-by-flag', 'snapshots')
  t.true((await fs.stat(snapshotsDirPath)).isDirectory())

  const snapshotStat = await fs.stat(path.join(snapshotsDirPath, 'button.png'))
  const originalSnapshotStat = await fs.stat(path.join(snapshotsDirPath, '..', 'button.restore.png'))

  t.true(snapshotStat.isFile())
  t.true(snapshotStat.size > 100)
  t.true(originalSnapshotStat.size !== snapshotStat.size)
})

test('can update a snapshot by environment variable', async t => {
  const env = {
    SHUTTER_API: process.env.SHUTTER_API || '',
    UPDATE_SHUTTER_SNAPSHOTS: 'true'
  }

  const scriptPath = path.join(__dirname, 'fixture-scripts', 'update-snapshot-by-env-var', 'index.js')
  const { code: exitCode, stderr } = await execa.shell(`ts-node '${scriptPath}'`, { env })

  t.is(exitCode, 0, `Expected script to exit with code 0. Failed with: ${stderr}`)

  const snapshotsDirPath = path.join(__dirname, 'fixture-scripts', 'update-snapshot-by-env-var', 'snapshots')
  t.true((await fs.stat(snapshotsDirPath)).isDirectory())

  const snapshotStat = await fs.stat(path.join(snapshotsDirPath, 'button.png'))
  const originalSnapshotStat = await fs.stat(path.join(snapshotsDirPath, '..', 'button.restore.png'))

  t.true(snapshotStat.isFile())
  t.true(snapshotStat.size > 100)
  t.true(originalSnapshotStat.size !== snapshotStat.size)
})
