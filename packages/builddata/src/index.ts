import createDebugLogger from 'debug'
import circleCI from './collectors/circle-ci'
import travisCI from './collectors/travis-ci'
import git from './collectors/git'
import npm from './collectors/npm'
import { Collector, CollectedMetadata } from './types'

export { CollectedMetadata }

const debug = createDebugLogger('shutter:builddata')

const genericCollectors: Collector[] = [
  git,
  npm
]

const ciCollectors: Collector[] = [
  circleCI,
  travisCI
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

  const genericMetadataCollections = await Promise.all(
    genericCollectors.map(collector => collectIfApplicable(collector, dirPath))
  )

  for (const genericMetadata of genericMetadataCollections) {
    collected = {
      ...collected,
      ...genericMetadata
    }
  }

  for (const collector of ciCollectors) {
    if (!await collector.testEnvironment(dirPath)) continue

    collected = {
      ...collected,
      ...(await collectIfApplicable(collector, dirPath))
    }
  }

  return collected
}
