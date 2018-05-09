import * as fs from 'fs'
import * as path from 'path'
import { retrieveFile, retrieveProcessedSnapshot } from '@shutter/api'
import { CommandFunction } from '../command'

export const minimumArgs = 2

export const help = `
  Usage
    $ shutter pull snapshot <snapshotID> <outputFilepath>

  Options
    --help              Show this help.

  Environment
    SHUTTER_HOST        Shutter service endpoint to use. For development purposes.
                        Something like: https://api.shutter.sh/
`

export const command: CommandFunction = async (args: string[], flags: {}) => {
  const whatToPull = args[0]

  switch (whatToPull) {
    case 'snapshot':
      const snapshotID = args[1]
      const outputPath = args[2]

      if (!snapshotID) throw new Error(`Lacking snapshot ID.`)
      if (!outputPath) throw new Error(`Lacking output path.`)

      const snapshot = await retrieveProcessedSnapshot(snapshotID)
      const blob = await retrieveFile(snapshot.result.rendered)
      fs.writeFileSync(outputPath, blob)

      console.error(`Wrote rendered snapshot to ${path.resolve(outputPath)}`)
      break
    default:
      throw new Error(`Don't know how to pull a "${whatToPull}".`)
  }
}
