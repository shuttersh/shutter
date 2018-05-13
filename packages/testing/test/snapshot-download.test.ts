import test from 'ava'
import { load as loadEnv } from 'dotenv'
import execa from 'execa'
import * as fs from 'mz/fs'
import * as path from 'path'

loadEnv()

test('downloads a snapshot for missing expectation', async t => {
  const env = {
    SHUTTER_API: process.env.SHUTTER_API
  }

  const scriptPath = path.join(__dirname, 'fixture-scripts', 'download-snapshot-missing-expectation', 'index.js')
  const { code: exitCode, stderr } = await execa.shell(`ts-node '${scriptPath}'`, { env })

  t.is(exitCode, 0, `Expected script to exit with code 0. Failed with: ${stderr}`)

  const snapshotsDirPath = path.join(__dirname, 'fixture-scripts', 'download-snapshot-missing-expectation', 'snapshots')
  t.true((await fs.stat(snapshotsDirPath)).isDirectory())

  const snapshotStat = await fs.stat(path.join(snapshotsDirPath, 'input-with-no-expectation.png'))
  t.true(snapshotStat.isFile())
  t.true(snapshotStat.size > 1000)
})

test.todo('can update a snapshot by command line argument')
test.todo('can update a snapshot by environment variable')
