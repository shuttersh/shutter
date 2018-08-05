import createDebugLogger from 'debug'
import circleCI from './collectors/circle-ci'
import travisCI from './collectors/travis-ci'
import git from './collectors/git'
import npm from './collectors/npm'
import { Collector, CollectedMetadata } from './types'

export { CollectedMetadata }

const debug = createDebugLogger('shutter:builddata')

const collectors: Collector[] = [
  // CI collectors:
  circleCI,
  travisCI,

  // Generic collectors:
  git,
  npm
]

function filterFalsyValues<T extends { [key: string]: any }> (input: T): Partial<T> {
  const output = Object.assign({}, input)
  for (const key of Object.keys(input)) {
    if (!output[key]) {
      delete output[key]
    }
  }
  return output
}

async function collectIfApplicable (collector: Collector, dirPath: string) {
  if (await collector.testEnvironment(dirPath)) {
    debug(`Collecting metadata using collector ${collector.name}...`)
    const collected = await collector.collect(dirPath)
    debug(`Metadata collected by collector ${collector.name}:`, collected)
    return filterFalsyValues(collected) as CollectedMetadata
  } else {
    debug(`Collector ${collector.name} does not seem to be applicable. Skipping.`)
    return {}
  }
}

export async function collectMetadata (dirPath: string = process.cwd()): Promise<CollectedMetadata> {
  let collected: CollectedMetadata = {}

  for (const collector of collectors) {
    if (!await collector.testEnvironment(dirPath)) continue

    collected = {
      ...collected,
      ...(await collectIfApplicable(collector, dirPath))
    }
  }

  return collected
}
